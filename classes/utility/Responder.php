<?php
/**
 * Created by PhpStorm.
 * User: Такси
 * Date: 25.08.15
 * Time: 22:47
 */

namespace Utility;


class Responder
{
    public function out(Array $content)
    {
        $this->outHeaders();
        $this->outContent($content);
    }
    private function outHeaders()
    {
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Last-Modified: ' . gmdate( 'D, d M Y H:i:s' ) . 'GMT');
        header('Cache-Control: no-cache, must-revalidate');
        header('Pragma: no-cache');
        header('Content-type: application/json');
    }
    private function outContent(Array $content)
    {
        echo json_encode($content);
    }
}