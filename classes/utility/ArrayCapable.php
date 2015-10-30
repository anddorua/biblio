<?php
/**
 * Created by PhpStorm.
 * User: Такси
 * Date: 24.08.15
 * Time: 22:44
 */

namespace Utility;


class ArrayCapable
{
    public function toArray()
    {
        return get_object_vars($this);
    }

    public function fromArray(Array $src)
    {
        $vars = get_object_vars($this);
        foreach ($vars as $k => $v) {
            if (array_key_exists($k, $src)) {
                $this->{$k} = $src[$k];
            }
        }
    }
}