import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config"

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const cid = data.get('cid') as unknown as string;
        const url = await pinata.gateways.public.convert(cid);
        return NextResponse.json(url, { status: 200 });
    } catch (e) {
        console.log(e);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
