<?php
/**
 * Created by PhpStorm.
 * User: �����
 * Date: 24.08.15
 * Time: 21:45
 */
namespace Application;
class BookItem extends \Utility\ArrayCapable
{
    protected $id = null;
    protected $author;
    protected $title;
    protected $isbn;
    protected $year;
    protected $owned_count;
    protected $store_count;

    public function __construct($param)
    {
        $this->fromArray($param);
    }
    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getOwnedCount()
    {
        return $this->owned_count;
    }

    /**
     * @param mixed $owned_count
     */
    public function setOwnedCount($owned_count)
    {
        $this->owned_count = $owned_count;
    }

    /**
     * @return mixed
     */
    public function getStoreCount()
    {
        return $this->store_count;
    }

    /**
     * @param mixed $store_count
     */
    public function setStoreCount($store_count)
    {
        $this->store_count = $store_count;
    }

    /**
     * @param null $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

}