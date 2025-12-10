import { createParamDecorator, ExecutionContext } from "@nestjs/common";

const userData = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com'
}

const getCurrentUserByContext = (data: string | undefined, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user;
    return data ? user?.[data] : user;
}

export const CurrentUser = createParamDecorator(
    (data: string | undefined, context: ExecutionContext): any => {
        return getCurrentUserByContext(data, context);
    }
)