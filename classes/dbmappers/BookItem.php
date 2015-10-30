<?php
/**
 * Created by PhpStorm.
 * User: Такси
 * Date: 30.08.15
 * Time: 23:19
 */

namespace DBMappers;


class BookItem extends ObjectMapper
{
    /**
     * @param $bookId int
     * @return \Application\BookItem|bool
     */
    public function getById($bookId)
    {
        if ($arr = \Utility\Database::getInstance()->fetchFirstAssoc("select * from books where id=:id", array(":id" => $bookId))) {
            return new \Application\BookItem($arr);
        } else {
            return false;
        }
    }

    /**
     * @param $author
     * @param $title
     * @param $year
     * @param $isbn
     * @return array|bool
     */
    public function getByMask($author, $title, $year, $isbn)
    {
        $sql_params = array();
        $where_clause = array();
        if (!empty($author)) {
            $where_clause[] = 'author like :author';
            $sql_params[':author'] = '%' . $author . '%';
        }
        if (!empty($title)) {
            $where_clause[] = 'title like :title';
            $sql_params[':title'] = '%' . $title . '%';
        }
        if (!empty($year)) {
            $where_clause[] = 'year = :year';
            $sql_params[':year'] = $year;
        }
        if (!empty($isbn)) {
            $where_clause[] = 'isbn = :isbn';
            $sql_params[':isbn'] = $isbn;
        }
        if (count($where_clause) == 0){
            $where_clause[] = '1';
        }
        $sql = "select * from books where " . implode(' and ', $where_clause) . ' order by author';
        //error_log("\n" . print_r($sql, true), 3, "my_errors.txt");
        //error_log("\n" . print_r($sql_params, true), 3, "my_errors.txt");
        $arr = \Utility\Database::getInstance()->fetchAllAssoc($sql, $sql_params);
        //error_log("\n" . print_r($arr, true), 3, "my_errors.txt");
        if ($arr !== false) {
            return array_map(function($item){ return new \Application\BookItem($item); }, $arr);
        } else {
            return false;
        }
    }

    public function save(\Application\BookItem $book)
    {
        $fields_to_save = $book->toArray();
        unset($fields_to_save['id']);
        if (is_null($book->getId()) || $book->getId() == '') {
            return $this->makeInsertQuery('books', $fields_to_save, \Utility\Database::getInstance());
        } else {
            return $this->makeUpdateQuery('books', $fields_to_save, array('id' => $book->getId()), \Utility\Database::getInstance());
        }
    }

}