<?php
/**
 * Created by PhpStorm.
 * User: Такси
 * Date: 19.09.15
 * Time: 16:38
 */

namespace Application;


class OperItem extends \Utility\ArrayCapable
{
    protected $login;
    protected $pwd_hash;
    protected $firstname;
    protected $lastname;
    protected $is_admin;

    /**
     * OperItem constructor.
     * @param $param array
     */
    public function __construct($param)
    {
        $this->fromArray($param);
    }

    /**
     * @return mixed
     */
    public function getLogin()
    {
        return $this->login;
    }

    /**
     * @param mixed $login
     */
    public function setLogin($login)
    {
        $this->login = $login;
    }

    /**
     * @return mixed
     */
    public function getPwdHash()
    {
        return $this->pwd_hash;
    }

    /**
     * @param mixed $pwd
     */
    public function setPwd($pwd)
    {
        $this->pwd_hash = self::HashPwd($pwd);
    }

    /**
     * @return mixed
     */
    public function isAdmin()
    {
        return $this->is_admin == 1;
    }

    /**
     * @param mixed $is_admin
     */
    public function setAdmin($is_admin)
    {
        $this->is_admin = $is_admin ? 1 : 0;
    }

    public static function HashPwd ($src)
    {
        if (is_null($src) || $src == '') {
            return null;
        } else {
            return sha1('jhgKJHG789%*%^&' . $src);
        }
    }

    /**
     * @return mixed
     */
    public function getFirstname()
    {
        return $this->firstname;
    }

    /**
     * @param mixed $firstname
     */
    public function setFirstname($firstname)
    {
        $this->firstname = $firstname;
    }

    /**
     * @return mixed
     */
    public function getLastname()
    {
        return $this->lastname;
    }

    /**
     * @param mixed $lastname
     */
    public function setLastname($lastname)
    {
        $this->lastname = $lastname;
    }

    public function isPasswordEqual($passToTest)
    {
        if (is_null($this->pwd_hash)) {
            return $passToTest == '' || is_null($passToTest);
        }
        return $this->pwd_hash == self::HashPwd($passToTest);
    }
}