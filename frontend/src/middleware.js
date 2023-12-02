import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = "oaiscmawiocnaoiwncioawniodnawoinda";

export async function middleware(req){
    if (req.nextUrl.pathname.startsWith('/login')) {
        console.log("ENTRASTE EN MIDDLEWARE DE PAGINA /login =====================");

        const jwt = req.cookies.get('tokenProyePUCP');
        if(jwt === undefined){
            console.log("No presentas token, quedate en el login");
            return NextResponse.next();
        }

        try{
            const {payload} = await jwtVerify(jwt.value,new TextEncoder().encode(secret));
            console.log("Eres un usuario valido, tienes que ir a tu dashboard!");
            return NextResponse.redirect(new URL('/dashboard',req.url));
        }catch(e){
            console.log("Tu token no es valido, quedate en el login");
            return NextResponse.next();
        }
    }


    console.log("ENTRASTE EN MIDDLEWARE PARA /dashboard/ o grupoProyectos* =====================");
    const jwt = req.cookies.get('tokenProyePUCP');
    if(jwt === undefined){
        console.log("No presentas token, chau");
        return NextResponse.redirect(new URL('/login',req.url));
    }

    try{
        const {payload} = await jwtVerify(jwt.value,new TextEncoder().encode(secret));
        const userRole = payload.user.rol;
        console.log("Tu rol es: ",userRole);
        if(userRole === 2){
            console.log("Eres un supervisor");
        }
        console.log("Eres un usuario valido, puedes continuar!");
        return NextResponse.next();
    }catch(e){
        console.log("Tu token no es valido, chau");
        return NextResponse.redirect(new URL('/login',req.url));
    }
}

//aplica para toda subruta de /dashboard
export const config = {
    matcher: ['/dashboard/:path*','/grupoProyectos/:path*','/login']
}