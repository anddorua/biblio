<?php
/**
 * Created by PhpStorm.
 * User: Такси
 * Date: 25.08.15
 * Time: 23:16
 */

namespace Utility;


class Action
{
    private $action;
    private $classInstance;
    private $methodName;
    private $params;
    private $unauthorized_methods = ['auth'];

    public function __construct($action)
    {
        $this->action = $action;
        $this->parseAction($action);
    }

    private function parseAction($action)
    {
        if (!isset($action['class'])) {
            throw new \Exception('Class not defined. Use \'class\' field to define class name containing invocable method.');
        }
        $className = '\\Invocable\\' . $action['class'];
        if (!class_exists($className)) {
            throw new \Exception('Class \'' . $className . '\' not exists.');
        }
        $this->classInstance = new $className;
        if (!($this->classInstance instanceof \Invocable\Base)) {
            throw new \Exception('Class \'' . $className . '\' not instance of \\Invocable\\Base.');
        }
        if (!isset($action['method'])) {
            throw new \Exception('Method name not defined. Use \'method\' field to define class method to invoke.');
        }
        $this->methodName = $action['method'];
        $auth = new \Utility\Authorization();
        if (!$auth->isAuthorized() && false === array_search($this->methodName, $this->unauthorized_methods)) {
            throw new \Utility\EUnauthorized("Необходима авторизация.");
        }
        if (!method_exists($this->classInstance, $this->methodName)) {
            throw new \Exception('Method \'' . $this->methodName . '\' not implemented.');
        }
        $this->params = isset($action['params']) ? is_array($action['params']) ? $action['params'] : array($action['params']) : array();
        //error_log(print_r($action, true), 3, 'my_errors.txt');
    }

    public function doAction()
    {
        return call_user_func(array($this->classInstance, $this->methodName), $this->params);
    }
}