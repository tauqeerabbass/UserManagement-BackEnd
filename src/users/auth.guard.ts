import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const token = req.headers['authorization'];

        if (!token || token !== "Bearer secret123"){
            console.log("User is not authorized")
            return false;
        }
        return true;
    }
}