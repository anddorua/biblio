<?php
namespace Utility;
class Database
{
    private static $instance = null;
    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * @var \PDO null
     */
    private $dbh = null;
    private $dsn = null;
    private $user = null;
    private $password = null;
    private $transactionCounter = 0;
    private $table_name_to_test;
    private $db_statement_producer_class_name;

    private function __construct()
    {
    }

    private function sureDbhSet()
    {
        if (!$this->dbh) {
            if ($this->dsn) {
                $this->dbh = new \PDO($this->dsn, $this->user, $this->password);
                if (!$this->tableExists($this->dbh, $this->table_name_to_test)) {
                    // create all tables
                    $producer_instance = new $this->db_statement_producer_class_name();
                    foreach($producer_instance as $statement) {
                        $this->dbh->exec($statement);
                    }
                }
            } else {
                throw new ENoDatabaseSet("No PDO instance set.");
            }
        }
    }

    private function tableExists(\PDO $pdo, $table_name)
    {
        try {
            $result = $pdo->query("SELECT 1 FROM $table_name LIMIT 1");
        } catch (\Exception $e) {
            return FALSE;
        }
        return $result !== FALSE;
    }

    public function setDSN ($dsn, $user, $password, $table_name_to_test, $db_statement_producer_class_name)
    {
        $this->dsn = $dsn;
        $this->user = $user;
        $this->password = $password;
        $this->table_name_to_test = $table_name_to_test;
        $this->db_statement_producer_class_name = $db_statement_producer_class_name;
    }
    public function query($statement, $data)
    {
        $this->sureDbhSet();
        $this->dbh->prepare($statement)->execute($data);

    }
    public function fetchAllAssoc($statement, $data)
    {
        $this->sureDbhSet();
        $st = $this->dbh->prepare($statement);
        $st->execute($data);
        return $st->fetchAll(\PDO::FETCH_ASSOC);
    }
    public function fetchFirstAssoc($statement, $data)
    {
        $this->sureDbhSet();
        $st = $this->dbh->prepare($statement);
        $st->execute($data);
        return $st->fetch(\PDO::FETCH_ASSOC);
    }
    public function exec($statement, $data)
    {
        $this->sureDbhSet();
        $st = $this->dbh->prepare($statement);
        return $st->execute($data);
    }

    public function getLastError() {
        if ($this->dbh) {
            return $this->dbh->errorInfo();
        } else {
            return false;
        }
    }

    public function beginTransaction()
    {
        $this->sureDbhSet();
        if ($this->transactionCounter == 0) {
            $this->transactionCounter++;
            return $this->dbh->beginTransaction();
        } else {
            return ++$this->transactionCounter > 0;
        }
    }

    public function commit()
    {
        if ($this->transactionCounter > 0) {
            $this->transactionCounter--;
            if ($this->transactionCounter == 0) {
                return $this->dbh->commit();
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    public function rollback()
    {
        if ($this->transactionCounter > 0) {
            $this->transactionCounter = 0;
            return $this->dbh->rollBack();
        } else {
            return false;
        }
    }

}