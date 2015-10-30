<?php
/**
 * Created by PhpStorm.
 * User: aahom_000
 * Date: 29.08.2015
 * Time: 15:10
 */

namespace Invocable;


class DataSource extends Base
{
    private $fakeBooks = array();
    private $fakeUsers = array();
    private function getFakeBooks()
    {
        $src = file_get_contents("test_db/books.json");
        if (count($this->fakeBooks) == 0) {
            $this->fakeBooks = json_decode($src);
        }
        return (array)$this->fakeBooks;
    }

    private function getFakeUsers()
    {
        $src = file_get_contents("test_db/users.json");
        if (count($this->fakeUsers) == 0) {
            $this->fakeUsers = json_decode($src);
        }
        return $this->fakeUsers;
    }

    private function saveFakeBooks($books)
    {
        file_put_contents("test_db/books.json", json_encode($books));
    }

    private function saveFakeUsers($users)
    {
        file_put_contents("test_db/users.json", json_encode($users));
    }

    private function sureBookIdPresent($params)
    {
        if (!isset($params["bookId"])) {
            throw new \Exception("bookId not set");
        }
    }

    public function getBook($params)
    {
        $this->sureBookIdPresent($params);
        if ($book = (new \DBMappers\BookItem())->getById($params["bookId"])) {
            return $book->toArray();
        } else {
            throw new \Exception("no book found with id " . $params["bookId"]);
        }
    }

    public function bookSave($params)
    {
        $book = new \Application\BookItem($params['book']);
        //error_log(print_r($params, true), 3, "my_errors.txt");
        //error_log(print_r(gettype($book->getId()), true), 3, "my_errors.txt");
        $mapper = new \DBMappers\BookItem();
        if (is_null($book->getId()) || $book->getId() == '') {
            $book->setOwnedCount($params['parameters']['adding']);
            $book->setStoreCount($params['parameters']['adding']);
        } else {
            $original = $mapper->getById($book->getId());
            $book->setOwnedCount($original->getOwnedCount() + $params['parameters']['adding']);
            $book->setStoreCount($original->getStoreCount() + $params['parameters']['adding']);
        }
        return $mapper->save($book);
    }

    public function userSave($params)
    {
        $user = new \Application\UserItem($params['user']);
        return (new \DBMappers\UserItem())->save($user);
    }

    public function getBooksByMask($params)
    {
        //error_log(print_r($params, true), 3, "my_errors.txt");
        $books = (new \DBMappers\BookItem())->getByMask($params['author'], $params['title'], $params['year'], isset($params['isbn']) ? $params['isbn'] : '');
        if ($books !== false) {
            return array_map(function($book){ return $book->toArray(); }, $books);
        } else {
            return false;
        }
    }

    public function getHolderList($params)
    {
        $userMapper = new \DBMappers\UserItem();
        $bookIssueMapper = new \DBMappers\BookIssueEntry();
        $issueEntries = $bookIssueMapper->getBookIssueEntries($params['bookId']);
        $result = array_map(function($entry) use ($userMapper){
            $res = new \stdClass();
            $res->when = $entry->getIssueTime();
            $res->amount = $entry->getAmount();
            $res->user = $userMapper->getById($entry->getReaderId())->toArray();
            return $res;
        }, $issueEntries);
        return $result;
    }

    public function userSearch ($params)
    {
        $users = (new \DBMappers\UserItem())->getBySurnameSample($params['surnameSample']);
        if ($users !== false) {
            return array_map(function($user){ return $user->toArray(); }, $users);
        } else {
            return false;
        }
    }

    private function sureUserIdPresent($params)
    {
        if (!isset($params["userId"])) {
            throw new \Exception("userId not set");
        }
    }

    public function getUser($params)
    {
        $this->sureUserIdPresent($params);
        if ($user = (new \DBMappers\UserItem())->getById($params["userId"])) {
            return $user->toArray();
        } else {
            throw new \Exception("no user found with id " . $params["userId"]);
        }
    }

    public function getUserBooks($params)
    {
        $this->sureUserIdPresent($params);
        $entryMapper = new \DBMappers\BookIssueEntry();
        $bookMapper = new \DBMappers\BookItem();
        $entries = $entryMapper->getUserIssueEntries($params['userId']);
        $result = array_map(function($entry) use ($bookMapper) {
            $resultEntry = new \stdClass();
            $resultEntry->when = $entry->getIssueTime();
            $resultEntry->amount = $entry->getAmount();
            $resultEntry->book = $bookMapper->getById($entry->getBookId())->toArray();
            return $resultEntry;
        }, $entries);
        //error_log("\nresult:" . print_r($result, true), 3, "my_errors.txt");
        return $result;
    }

    public function issueBooks($params)
    {
        $entryMapper = new \DBMappers\BookIssueEntry();
        $bookMapper = new \DBMappers\BookItem();
        $readerMapper = new \DBMappers\UserItem();
        \Utility\Database::getInstance()->beginTransaction();
        try {
            $reader = $readerMapper->getById($params['user']['id']);
            foreach($params['bookIssueList'] as $bookIssueEntryData) {
                $bookIssueEntry = new \Application\BookIssueEntry(array(
                    'book_id' => $bookIssueEntryData['book']['id'],
                    'reader_id' => $params['user']['id'],
                    'amount' => $bookIssueEntryData['amount']
                ));
                $reader->setHoldCount($reader->getHoldCount() + $bookIssueEntry->getAmount());
                $book = $bookMapper->getById($bookIssueEntry->getBookId());
                $book->setStoreCount($book->getStoreCount() - $bookIssueEntry->getAmount());
                $bookMapper->save($book);
                $entryMapper->insert($bookIssueEntry);
            }
            $readerMapper->save($reader);
            if (!\Utility\Database::getInstance()->commit()) {
                throw new \Exception(\Utility\Database::getInstance()->getLastError());
            }
        } catch (\Exception $e) {
            \Utility\Database::getInstance()->rollback();
            throw $e;
        }
    }

    private function getEntriesToChange($returnBookId, $returnBookCount, $issues)
    {
        $result = new \stdClass();
        $result->toDelete = array();
        $result->toChange = array();
        $result->amountToWithdraw = 0;
        $i = 0;
        while ($returnBookCount > 0 && $i < count($issues)) {
            if ($issues[$i]->getBookId() == $returnBookId) {
                $withdraw = min($issues[$i]->getAmount(), $returnBookCount);
                $result->amountToWithdraw += $withdraw;
                $returnBookCount -= $withdraw;
                $issues[$i]->setAmount($issues[$i]->getAmount() - $withdraw);
                if ($issues[$i]->getAmount() == 0) {
                    $result->toDelete[] = $issues[$i];
                } else {
                    $result->toChange[] = $issues[$i];
                }
            }
            $i++;
        }
        return $result;
    }

    private function getSortedBookIssues($readerId, \DBMappers\BookIssueEntry $entryMapper)
    {
        $issues = $entryMapper->getUserIssueEntries($readerId);
        usort($issues, function($a, $b) {
            if ($a->getIssueTime() < $b->getIssueTime()) {
                return -1;
            } else if($a->getIssueTime() == $b->getIssueTime()) {
                return 0;
            } else {
                return 1;
            }
        });
        return $issues;
    }

    public function returnBooks($params)
    {
        //error_log("\nparams:" . print_r($params, true), 3, "my_errors.txt");
        $entryMapper = new \DBMappers\BookIssueEntry();
        $bookMapper = new \DBMappers\BookItem();
        $readerMapper = new \DBMappers\UserItem();
        \Utility\Database::getInstance()->beginTransaction();
        try {
            $reader = $readerMapper->getById($params['user']['id']);
            foreach($params['bookIssueList'] as $bookIssueEntryData) {
                $book = $bookMapper->getById($bookIssueEntryData['book']['id']);
                $issues = $this->getSortedBookIssues($reader->getId(), $entryMapper);
                $changes = $this->getEntriesToChange($book->getId(), $bookIssueEntryData['amount'], $issues);
                $reader->setHoldCount($reader->getHoldCount() - $changes->amountToWithdraw);
                foreach($changes->toDelete as $deleteEntry) {
                    $entryMapper->deleteById($deleteEntry->getId());
                }
                foreach($changes->toChange as $changeEntry) {
                    $entryMapper->update($changeEntry);
                }
                $book->setStoreCount($book->getStoreCount() + $changes->amountToWithdraw);
                $bookMapper->save($book);
            }
            $readerMapper->save($reader);
            if (!\Utility\Database::getInstance()->commit()) {
                throw new \Exception(\Utility\Database::getInstance()->getLastError());
            }
        } catch (\Exception $e) {
            \Utility\Database::getInstance()->rollback();
            throw $e;
        }
    }

    public function auth($params)
    {
        $result = new \stdClass();
        $result->login = $params['login'];
        $result->isAuthenticated = false;
        $result->isAdmin = false;
        $result->requireChangePassword = true;
        $operMapper = new \DBMappers\OperItem();
        sleep(1);
        if ($operItem = $operMapper->getByLogin($result->login)) {
            if ($operItem->isPasswordEqual($params['password'])) {
                $result->firstname = $operItem->getFirstname();
                $result->lastname = $operItem->getLastname();
                $result->isAuthenticated = true;
                $result->isAdmin = $operItem->isAdmin();
                $result->requireChangePassword = is_null($operItem->getPwdHash());
                $auth = new \Utility\Authorization();
                $auth->setAuthorized($operItem->getLogin(), $operItem->isAdmin());
            }
        };
        return $result;
    }

    public function getOper($params)
    {
        $operMapper = new \DBMappers\OperItem();
        $operItemArray = $operMapper->getByLogin($params['login'])->toArray();
        unset($operItemArray['password']);
        return $operItemArray;
    }

    public function operDataSave($params)
    {
        $operMapper = new \DBMappers\OperItem();
        $operItem = $operMapper->getByLogin($params['login']);
        $operItem->setFirstname($params['firstname']);
        $operItem->setLastname($params['lastname']);
        if ($params['password'] != '' || $params['password-new1'] != '') {
            if (!$operItem->isPasswordEqual($params['password'])) {
                throw new \Exception("Неверно указан старый пароль.");
            }
            $operItem->setPwd($params['password-new1']);
        }
        $operMapper->save($operItem);
        $operItemArray = $operItem->toArray();
        //error_log("\noper:" . print_r($operItemArray, true), 3, "my_errors.txt");
        unset($operItemArray['password']);
        return $operItemArray;
    }

    public function logout()
    {
        (new \Utility\Authorization())->setUnauthorized();
    }
}