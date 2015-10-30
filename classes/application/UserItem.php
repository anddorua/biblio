<?php
/**
 * Created by PhpStorm.
 * User: aahom_000
 * Date: 29.08.2015
 * Time: 22:25
 */

namespace Application;


class UserItem extends \Utility\ArrayCapable
{
    protected $id;
    protected $surname;
    protected $firstname;
    protected $middlename;
    protected $dateofbirth;
    protected $address;
    protected $phone;
    protected $reg_date;
    protected $hold_count;

    public function __construct($srcArray)
    {
        $this->fromArray($srcArray);
        if (is_null($this->hold_count)) {
            $this->hold_count = 0;
        }
    }

    /**
     * @return mixed
     */
    public function getHoldCount()
    {
        return empty($this->hold_count) ? 0 : $this->hold_count;
    }

    /**
     * @param mixed $hold_count
     */
    public function setHoldCount($hold_count)
    {
        $this->hold_count = $hold_count;
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

}