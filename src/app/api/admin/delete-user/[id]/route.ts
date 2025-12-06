import { NextResponse } from "next/server";
import { deleteUser } from "../../../../lib/fakeDB";

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  try {
    const deleted = deleteUser(id);
    return NextResponse.json({ deleted });
  } catch {
    return NextResponse.json(
      { error: "Utilisateur introuvable" },
      { status: 404 }
    );
  }
}
