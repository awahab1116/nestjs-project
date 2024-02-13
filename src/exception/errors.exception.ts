/**
 * This module contains custom exceptions for the application.
 * Each class extends the HttpException class from the @nestjs/common package.
 * The HttpException class takes in a message and a status code as parameters.
 * The message is a string that describes the error.
 * The status code is a number that represents the HTTP status code.
 */

import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * UserNotFoundException is thrown when a user is not found.
 * The default message is 'User not found' and the default status code is 404 (HttpStatus.NOT_FOUND).
 */
export class UserNotFoundException extends HttpException {
  constructor(message?: string, statusCode?: number) {
    super(message || 'User not found', statusCode || HttpStatus.NOT_FOUND);
  }
}

/**
 * LoginPasswordInvalidException is thrown when the login password is invalid.
 * The default message is 'Login Password invalid' and the default status code is 401 (HttpStatus.UNAUTHORIZED).
 */
export class LoginPasswordInvalidException extends HttpException {
  constructor(message?: string, statusCode?: number) {
    super(
      message || 'Login Password invalid',
      statusCode || HttpStatus.UNAUTHORIZED,
    );
  }
}

/**
 * ProductIdsInvalidException is thrown when the product IDs provided are invalid.
 * The default message is 'Cannot place order,product not found' and the default status code is 404 (HttpStatus.NOT_FOUND).
 */
export class ProductIdsInvalidException extends HttpException {
  constructor(message?: string, statusCode?: number) {
    super(
      message || 'Cannot place order,product not found',
      statusCode || HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * ProductOutOfStockException is thrown when the product is out of stock.
 * The default message is 'Cannot place order,product is out of stock' and the default status code is 400 (HttpStatus.BAD_REQUEST).
 */
export class ProductOutOfStockException extends HttpException {
  constructor(message?: string, statusCode?: number) {
    super(
      message || 'Cannot place order,product is out of stock',
      statusCode || HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * OrderNotPlacedException is thrown when an order cannot be placed.
 * The default message is 'Order cannot be placed' and the default status code is 400 (HttpStatus.BAD_REQUEST).
 */
export class OrderNotPlacedException extends HttpException {
  constructor(message?: string, statusCode?: number) {
    super(
      message || 'Order cannot be placed',
      statusCode || HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * OrderNotFound is thrown when an order cannot be found against a given id.
 * The default message is 'Order cannot be found against given id' and the default status code is 404 (HttpStatus.NOT_FOUND).
 */
export class OrderNotFound extends HttpException {
  constructor(message?: string, statusCode?: number) {
    super(
      message || 'Order cannot be found against given id',
      statusCode || HttpStatus.NOT_FOUND,
    );
  }
}
