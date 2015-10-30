<?php
/**
 * Created by PhpStorm.
 * User: Такси
 * Date: 19.09.15
 * Time: 14:31
 */

namespace Utility;


class Authorization
{
    public function __construct()
    {
        $sStatus = session_status();
        if ($sStatus == PHP_SESSION_DISABLED) {
            throw new EUnauthorized("sessions disabled, check php server settings");
        }
        if ($sStatus == PHP_SESSION_NONE) {
            if (!session_start()) {
                throw new EUnauthorized("session didn't start");
            }
        }
    }

    public function isAuthorized()
    {
        return isset ($_SESSION['oper_id']);
    }

    public function setAuthorized($oper_id, $isAdmin)
    {
        $_SESSION['oper_id'] = $oper_id;
        $_SESSION['is_admin'] = $isAdmin;
    }

    public function setUnauthorized()
    {
        session_destroy();
        session_commit();
    }
}