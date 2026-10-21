import { db } from "./index";
import { profiles } from "./schema/profiles";
import { eq } from "drizzle-orm";

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();

  if (!email) {
    console.error("❌ Mohon masukkan email target! Contoh:");
    console.log("   npm run db:promote-admin your-email@example.com");
    process.exit(1);
  }

  console.log(`🔍 Mencari profil dengan email: ${email}...`);

  const userProfile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, email))
    .limit(1);

  if (userProfile.length === 0) {
    console.error(`❌ Profil untuk email "${email}" belum ditemukan di database.`);
    console.log("💡 Pastikan user sudah mendaftar (register) terlebih dahulu melalui website.");
    process.exit(1);
  }

  await db
    .update(profiles)
    .set({ role: "admin" })
    .where(eq(profiles.email, email));

  console.log(`🎉 SUKSES! Pengguna "${email}" telah diangkat menjadi ADMIN!`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Gagal mengupdate role:", err);
  process.exit(1);
});
