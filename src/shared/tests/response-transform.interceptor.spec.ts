import { createMock } from '@golevelup/ts-jest'
import { ExecutionContext } from '@nestjs/common'
import { of } from 'rxjs'
import { TransformInterceptor } from '../interceptors/response-transform.interceptor'
import { FastifyReply } from 'fastify'

interface Data {
	id: number
	username: 'mamad'
}

describe('TransformInterceptor', () => {
	const executionContext = createMock<ExecutionContext>()
	const transformInterceptor = new TransformInterceptor()

	it("should wrap the next handler response in 'data' object", function (done) {
		// Arrange
		executionContext.switchToHttp().getResponse<FastifyReply>().statusCode = 201
		const someData: Data = {
			id: 1,
			username: 'mamad'
		}

		// This guarantees our data will be returned to our interceptor
		const callHandler = {
			handle() {
				return of(someData)
			}
		}

		// Act
		transformInterceptor.intercept(executionContext, callHandler).subscribe((asyncData) => {
			// Assert
			expect(asyncData).toEqual({
				statusCode: 201,
				data: someData
			})
			done()
		})
	})
})
