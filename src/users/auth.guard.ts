// import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";

// @Injectable()
// export class AuthGuard implements CanActivate{
//     constructor(private jwtService: JwtService){}
//     canActivate(context: ExecutionContext): boolean {
//         const req = context.switchToHttp().getRequest();
//         const header = req.headers.authorization;
//         if(!header){
//             console.log("No authorization header found");
//             return false;
//         }
//         const token = header.split(" ")[1];

//         try {
//             const payload = this.jwtService.verify(token, {secret: process.env.NESTAUTH_SECRET});
//             req.user = payload;
//             return true;
//         } catch (error) {   
//             throw new Error("Error in auth guard" + error.message);
//         }
//     }
// }