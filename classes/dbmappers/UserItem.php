<?php
/**
 * Created by PhpStorm.
 * User: Такси
 * Date: 30.08.15
 * Time: 23:19
 */

namespace DBMappers;


class UserItem extends ObjectMapper
{
    /**
     * @param $userId int
     * @return \Application\UserItem|bool
     */
    public function getById($userId)
    {
        if ($arr = \Utility\Database::getInstance()->fetchFirstAssoc("select * from readers where id=:id", array(":id" => $userId))) {
            return new \Application\UserItem($arr);
        } else {
            return false;
        }
    }

    /**
     * @param $surnameSample string
     * @return array|bool
     */
    public function getBySurnameSample($surnameSample)
    {
        $sql = "select * from readers where surname like :surname order by surname";
        $arr = \Utility\Database::getInstance()->fetchAllAssoc($sql, array(':surname' => '%' . $surnameSample . '%'));
        if ($arr !== false) {
            return array_map(function($item){ return new \Application\UserItem($item); }, $arr);
        } else {
            return false;
        }
    }


    public function save(\Application\UserItem $user)
    {
        $fields_to_save = $user->toArray();
        unset($fields_to_save['reg_date']);
        unset($fields_to_save['id']);
        if (is_null($user->getId())) {
            unset($fields_to_save['hold_count']);
            return $this->makeInsertQuery('readers', $fields_to_save, \Utility\Database::getInstance());
        } else {
            return $this->makeUpdateQuery('readers', $fields_to_save, array('id' => $user->getId()), \Utility\Database::getInstance());
        }
    }
}