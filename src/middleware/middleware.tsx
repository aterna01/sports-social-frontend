const { createCustomLogger } = require('../../next-logger.config');
import { NextResponse } from 'next/server';

export function middleware(req) {
  // Log the request details
  const logger = createCustomLogger();

  logger().info('Incoming request', {
    method: req.method,
    url: req.url,
    headers: req.headers,
  });

  // Continue to the next middleware or route
  return NextResponse.next();
}
