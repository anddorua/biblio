<?php
/**
 * Created by PhpStorm.
 * User: Такси
 * Date: 26.08.15
 * Time: 0:34
 */

namespace Utility;


class RequestDecoder
{
    public function getRequest()
    {
        $headers = apache_request_headers();
        if (isset($headers['Content-Type'])) {
            $ctype = explode(';', $headers['Content-Type']);
            if ($ctype[0] == 'application/x-www-form-urlencoded') {
                return $_REQUEST;
            } else if ($ctype[0] == 'application/json') {
                $raw_data = file_get_contents("php://input");
                return $this->objectToArray(json_decode($raw_data));
            } else {
                throw new \Exception ('Unrecognized Content-Type header:' . $headers['Content-Type']);
            }
        } else {
            throw new \Exception ('Content-Type header must be set for proper request parsing');
        }
    }

    private function objectToArray ($object) {
        if(!is_object($object) && !is_array($object))
            return $object;

        return array_map(function($obj){ return $this->objectToArray($obj); }, (array) $object);
    }
}