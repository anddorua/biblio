<?php
class BookMapperTest extends PHPUnit_Framework_TestCase
{

    protected static $db = null;
    public static function setUpBeforeClass()
    {
        self::$db = new \Utility\Database(new PDO("mysql:host=localhost;dbname=biblio", "root", ""));
    }

    public static function tearDownAfterClass()
    {
        self::$db = null;
    }

    public function testCanPDOConnect()
    {
        $this->assertInstanceOf('\Utility\Database', self::$db);
    }

    public function testCanBookAdd()
    {
        //$book = new \Application\BookItem(null, "Автор", "Название", "1234567890123", 1973, 2, 1);
    }
    // ...
}