<?php
class BookTest extends PHPUnit_Framework_TestCase
{
    public function testCanBeCreated()
    {
        $book = new \Application\BookItem(1, "Author", "Title", "1234567890123", 1973, 2, 1);
        //$book2 = new \Application\BookItem(array("id" => 1, "author" => "Author", "title" => "Title", "isbn" => "1234567890123", "year" => 1973, "ownedCount" => 2, "storeCount" => 1));
        //$book2 = new \Application\BookItem(array(1, "Author", "Title", "1234567890123", 1973, 2, 1));
        //$a = $book->toArray();
        $this->assertTrue(true);
    }
    // ...
}