<?php
class Reader {
    private $file;

    public function __construct($file) {
        $this->file = $file;
    }

    private function randomWord($start, $end) {
        fseek($this->file, mt_rand($start, $end));
        return fread($this->file, 40);
    }

    final public function randomWords($start, $end, $count) {
        $words = array();
        for ($i = 0; $i < $count; $i++) {
            $word = $this->randomWord($start, $end);
            preg_match('/.*\n(.*?)\n.*/', $word, $match);
            $words[] = isset($match[1]) ? trim($match[1]) : null;
        }
        return array_filter($words);
    }
}

class DictionaryReader extends Reader {
    private const fileName = "../data/dictionary.txt";
    private $file, $offset;

    public function __construct() {
        $this->file = fopen(self::fileName, 'r');
        parent::__construct($this->file);
        $this->prepareOffsets();
    }

    public function __destruct() {
        fclose($this->file);
    }

    private function prepareOffsets() {
        $this->offset[2]  = 0;
        $this->offset[3]  = 548;
        $this->offset[4]  = 9102;
        $this->offset[5]  = 60573;
        $this->offset[6]  = 268107;
        $this->offset[7]  = 799541;
        $this->offset[8]  = 1972949;
        $this->offset[9]  = 4113378;
        $this->offset[10] = 7480657;
        $this->offset[11] = 12096570;
        $this->offset[12] = 17741255;
        $this->offset[13] = 23971094;
        $this->offset[14] = 30323385;
        $this->offset[15] = 36365699;
        $this->offset[16] = 41672146;
    }

    private function randomWordsOfLength($len, $count) {    
        $start = $this->offset[$len];
        $end = $this->offset[$len+1];
        return $this->randomWords($start, $end, $count);
    }

    final public function getWords() {
        $words = array();
        $words = array_merge($words, $this->randomWordsOfLength(3, 2));
        $words = array_merge($words, $this->randomWordsOfLength(4, 4));
        $words = array_merge($words, $this->randomWordsOfLength(5, 5));
        $words = array_merge($words, $this->randomWordsOfLength(6, 6));
        $words = array_merge($words, $this->randomWordsOfLength(7, 6));
        $words = array_merge($words, $this->randomWordsOfLength(8, 5));
        $words = array_merge($words, $this->randomWordsOfLength(9, 3));
        $words = array_merge($words, $this->randomWordsOfLength(10, 2));
        $words = array_merge($words, $this->randomWordsOfLength(11, 1));
        $words = array_unique($words);
        shuffle($words);
        return $words;
    }
}

class NounsReader extends Reader {
    private const fileName = "../data/nouns.txt";
    private $file, $start, $end;

    public function __construct() {
        $this->file = fopen(self::fileName, 'r');
        parent::__construct($this->file);
        $this->prepareOffsets();
    }

    public function __destruct() {
        fclose($this->file);
    }

    private function prepareOffsets() {
        $this->start = 0;
        $this->end = 629386;
    }

    final public function getWords() {
        $words = $this->randomWords($this->start, $this->end, 35);
        $words = array_unique($words);
        shuffle($words);
        return $words;
    }
}

class Printer {
    private $reader;
    
    public function __construct($reader) {
        $this->reader = $reader;
    }
    
    final public function print() {
        $reader = new $this->reader();  
        echo '[ "' . implode('", "', $reader->getWords()) . '" ]'; 
    }
}
?>