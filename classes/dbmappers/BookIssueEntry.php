<?php
/**
 * Created by PhpStorm.
 * User: Такси
 * Date: 30.08.15
 * Time: 23:19
 */

namespace DBMappers;


class BookIssueEntry extends ObjectMapper
{
    public function insert(\Application\BookIssueEntry $entry)
    {
        $fields_to_save = $entry->toArray();
        unset($fields_to_save['id']);
        unset($fields_to_save['issue_time']);
        return $this->makeInsertQuery('book_issue_data', $fields_to_save, \Utility\Database::getInstance());
    }

    public function getUserIssueEntries($userId)
    {
        $sql = "select * from book_issue_data where reader_id=:reader_id";
        $rawEntries = \Utility\Database::getInstance()->fetchAllAssoc($sql, array(':reader_id' => $userId));
        $result = array_map(function($rawEntry){
            return new \Application\BookIssueEntry($rawEntry);
        }, $rawEntries);
        return $result;
    }

    public function getBookIssueEntries($bookId)
    {
        $sql = "select * from book_issue_data where book_id=:book_id";
        $rawEntries = \Utility\Database::getInstance()->fetchAllAssoc($sql, array(':book_id' => $bookId));
        $result = array_map(function($rawEntry){
            return new \Application\BookIssueEntry($rawEntry);
        }, $rawEntries);
        return $result;
    }

    public function deleteById($id)
    {
        return \Utility\Database::getInstance()->exec('delete from book_issue_data where id=:id', array(':id' => $id));
    }

    public function update(\Application\BookIssueEntry $entry)
    {
        $fields_to_save = $entry->toArray();
        unset($fields_to_save['id']);
        unset($fields_to_save['issue_time']);
        return $this->makeUpdateQuery('book_issue_data', $fields_to_save, array('id' => $entry->getId()), \Utility\Database::getInstance());
    }
}