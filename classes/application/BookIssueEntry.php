<?php
/**
 * Created by PhpStorm.
 * User: Такси
 * Date: 06.09.15
 * Time: 18:12
 */

namespace Application;


class BookIssueEntry extends \Utility\ArrayCapable
{
    protected $id;
    protected $book_id;
    protected $reader_id;
    protected $issue_time;
    protected $amount;

    public function __construct($param)
    {
        $this->fromArray($param);
    }

    /**
     * @return mixed
     */
    public function getBookId()
    {
        return $this->book_id;
    }

    /**
     * @return mixed
     */
    public function getReaderId()
    {
        return $this->reader_id;
    }

    /**
     * @return mixed
     */
    public function getAmount()
    {
        return $this->amount;
    }

    /**
     * @param mixed $amount
     */
    public function setAmount($amount)
    {
        $this->amount = $amount;
    }


    /**
     * @return mixed
     */
    public function getIssueTime()
    {
        return $this->issue_time;
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

}