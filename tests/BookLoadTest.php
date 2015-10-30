<?php
class BookLoadTest extends PHPUnit_Framework_TestCase
{
    public function testCanBeCreated()
    {
        \Utility\Database::getInstance()->setDSN('mysql:host=localhost;dbname=biblio', "root", "");
        $loader = new \DBMappers\BookItem();
        $book = $loader->getById(1);
        $this->assertInstanceOf('\Application\BookItem', $book);
        $this->assertEquals(1, $book->getId());
    }
    // ...
}