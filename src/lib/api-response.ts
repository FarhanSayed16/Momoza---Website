import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types'

export function successResponse<T>(data: T, status: number = 200) {
  const response: ApiResponse<T> = {
    success: true,
    data
  }
  return NextResponse.json(response, { status })
}

export function errorResponse(error: string, status: number = 400, code?: number) {
  const response: ApiResponse<null> = {
    success: false,
    error,
    code
  }
  return NextResponse.json(response, { status })
}
