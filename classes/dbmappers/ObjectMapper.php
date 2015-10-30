<?php
/**
 * Created by PhpStorm.
 * User: Такси
 * Date: 01.09.15
 * Time: 23:20
 */

namespace DBMappers;


class ObjectMapper
{
    protected function makeInsertQuery($table_name, $fields_to_save, \Utility\Database $db)
    {
        $field_list = array_keys($fields_to_save);
        $field_list_imploded = implode(',', $field_list);
        $value_var_list = array_map(function($var_name){return ':' . $var_name;}, $field_list);
        $value_list = array_combine($value_var_list, array_values($fields_to_save));
        $sql = "insert into $table_name ($field_list_imploded) values (" . implode(',', $value_var_list) . ")";
        return $db->exec($sql, $value_list);
    }

    protected function makeUpdateQuery($table_name, $fields_to_save, array $where_condition, \Utility\Database $db)
    {
        $value_equation_list_imploded = $this->makeEquationString(',', $fields_to_save);
        $value_list = $this->makeValueVarArray($fields_to_save);
        $sql = "update $table_name set $value_equation_list_imploded where " . $this->makeEquationString(' and ', $where_condition);
        $value_list = array_merge($value_list, $this->makeValueVarArray($where_condition));
        //error_log("\nSQL:" . print_r($sql, true) . "\nvalues:" . print_r($value_list, true), 3, "my_errors.txt");
        return \Utility\Database::getInstance()->exec($sql, $value_list);

    }

    private function makeEquationString($glue, array $key_value)
    {
        $field_list = array_keys($key_value);
        $value_equation_list = array_map(function($var_name){ return $var_name . '=:' . $var_name; }, $field_list);
        return implode($glue, $value_equation_list);
    }

    /**
     * makes array of type [':field_name' => field_value] from ['field_name' => field_value]
     * @param $fields_to_save array
     * @return array
     */
    private function makeValueVarArray($fields_to_save)
    {
        $field_list = array_keys($fields_to_save);
        $value_var_list = array_map(function($var_name){return ':' . $var_name;}, $field_list);
        return array_combine($value_var_list, array_values($fields_to_save));
    }
}