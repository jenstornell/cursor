<?php
class KnockException extends Exception {
  public function __construct($message) {
      parent::__construct($message);
  }
}