<?php
/**
 * Created by PhpStorm.
 * User: Такси
 * Date: 26.08.15
 * Time: 22:32
 */

namespace Invocable;


abstract class Base
{
    public function stub()
    {
        return __METHOD__ . "(" . print_r(func_get_args(), true) . ")";
    }
}