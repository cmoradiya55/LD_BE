import { createParamDecorator, ExecutionContext } from "@nestjs/common";

const getCurrentUserByContext = (data: string | undefined, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user;
    return data ? user?.[data] : user;
}

export const CurrentCustomer = createParamDecorator(
    (data: string | undefined, context: ExecutionContext): any => {
        return getCurrentUserByContext(data, context);
    }
)