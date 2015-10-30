<?php
ini_set('display_errors', 'Off');
ini_set('log_errors', 'On');
ini_set("error_log", "my_errors.txt");
error_reporting(E_ALL);

require_once("classes/autoload.php");
require_once("classes/constants.php");
$responder = new \Utility\Responder();
$requestDecoder = new \Utility\RequestDecoder();
\Utility\Database::getInstance()->setDSN(
    'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8',
    DB_USER,
    DB_PASSWORD,
    'opers',
    '\\Utility\\TablesCreateScript');
try {
    $request = (new \Utility\RequestDecoder())->getRequest();
    //error_log(print_r($request, true), 3, 'my_errors.txt');
    $responder->out([
        'status' => 'ok',
        'response' => isset($request['act']) ? (new \Utility\Action($request['act']))->doAction() : print_r($request, true)
    ]);
} catch(\Utility\EUnauthorized $e) {
    $responder->out([
        'status' => 'auth',
        'response' => $e->getMessage()
    ]);
} catch (\Exception $e) {
    $msg = $e->getMessage();
    if ($e->getCode() == 2002) { // очень кривой костыль
        $msg = iconv('Windows-1251', 'UTF-8', $msg);
    }
    $responder->out([
        'status' => 'error',
        'response' => $msg
    ]);
}