<?php
/**
 * Created by PhpStorm.
 * User: Такси
 * Date: 26.08.15
 * Time: 22:57
 */

namespace Invocable;


class Test extends Base
{
    public function foo()
    {
        return "Foo";
    }
    public function respond($param)
    {
        error_log(print_r($param, true), 3, 'my_errors.txt');

        return $param;
    }
}