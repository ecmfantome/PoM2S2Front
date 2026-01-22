import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const res = await fetch(
    `http://localhost:9090/api/v1/module/${params.id}`
  );

  const data = await res.json();

  if (!res.ok)
    return NextResponse.json({ error: "Module introuvable" }, { status: 404 });

  return NextResponse.json({ module: data });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const payload = {
    id: params.id,
    name: body.name,
    semester: body.semester,
    code: body.code,
    createdBy: body.createdBy,
    responsibleId: body.responsibleId,
  };

  const res = await fetch("http://localhost:9090/api/v1/module", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok)
    return NextResponse.json({ error: data }, { status: res.status });

  return NextResponse.json({
    message: "Module modifié",
    module: data,
  });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const res = await fetch(
    `http://localhost:9090/api/v1/module/${params.id}`,
    { method: "DELETE" }
  );

  if (!res.ok)
    return NextResponse.json({ error: "Suppression échouée" });

  return NextResponse.json({ message: "Module supprimé" });
}
