<?php
/**
 * Created by PhpStorm.
 * User: Такси
 * Date: 19.09.15
 * Time: 16:42
 */

namespace DBMappers;


class OperItem extends ObjectMapper
{
    public function getByLogin($login)
    {
        if ($arr = \Utility\Database::getInstance()->fetchFirstAssoc("select * from opers where login=:login", array(":login" => $login))) {
            return new \Application\OperItem($arr);
        } else {
            return false;
        }
    }

    public function save(\Application\OperItem $oper)
    {
        $fields_to_save = $oper->toArray();
        if ($this->getByLogin($oper->getLogin()) === false){
            return $this->makeInsertQuery('opers', $fields_to_save, \Utility\Database::getInstance());
        } else {
            unset($fields_to_save['login']);
            return $this->makeUpdateQuery('opers', $fields_to_save, array('login' => $oper->getLogin()), \Utility\Database::getInstance());
        }
    }
}