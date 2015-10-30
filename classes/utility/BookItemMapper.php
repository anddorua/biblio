<?php
/**
 * Created by PhpStorm.
 * User: Такси
 * Date: 24.08.15
 * Time: 23:24
 */

namespace Utility;


class BookItemMapper
{
    private $pdo;

    /**
     * BookItemMapper constructor.
     * @param $pdo
     */
    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function save(\Application\BookItem $bookItem)
    {
        if (is_null($bookItem->getId())) {

        }
    }
}