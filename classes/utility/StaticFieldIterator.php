<?php
/**
 * Created by PhpStorm.
 * User: Такси
 * Date: 16.10.15
 * Time: 17:50
 */

namespace Utility;

/**
 * Создает интерфейс итератора по статическим полям класса (поля - массивы).
 * Применяется для класса обертки скритпа создания базы данных
 * Class StaticFieldIterator
 * @package Helpers
 */
trait StaticFieldIterator
{
    private $staticFieldIteratorKey = 0;
    private $staticFieldIteratorData;

    public function current()
    {
        return current($this->staticFieldIteratorData)[$this->staticFieldIteratorKey];
    }

    public function next()
    {
        $this->staticFieldIteratorKey++;
        if ($this->staticFieldIteratorKey >= count(current($this->staticFieldIteratorData))) {
            $this->staticFieldIteratorKey = 0;
            next($this->staticFieldIteratorData);
        }
    }

    public function key()
    {
        return $this->staticFieldIteratorKey;
    }

    public function valid()
    {
        return current($this->staticFieldIteratorData) !== false && isset(current($this->staticFieldIteratorData)[$this->staticFieldIteratorKey]);
    }

    public function rewind()
    {
        $class_name = get_class($this);
        $reflection = new \ReflectionClass($class_name);
        $this->staticFieldIteratorData = $reflection->getStaticProperties();
        $this->staticFieldIteratorKey = 0;
        reset($this->staticFieldIteratorData);
    }
}