import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const username = process.env.ADMIN_USERNAME || "admin";
    const passwordHash = process.env.ADMIN_PW_HASH || "$2b$10$EpWaTgi/F.v.q.v.v.v.v.v.v.v.v.v.v.v.v.v.v.v.v.v.v";

    const admin = await prisma.admin.upsert({
        where: { username },
        update: {},
        create: {
            username,
            password_hash: passwordHash,
            display_name: "Admin User",
            roles: "superadmin",
        },
    });

    console.log({ admin });

    const sampleStories = [
        {
            title_ar: "الظلال الهامسة",
            title_en: "The Whispering Shadows",
            slug: "the-whispering-shadows",
            excerpt_ar: "في أعماق الغابة، حيث لا يجرؤ الضوء على الدخول، تعيش كائنات تتغذى على الخوف...",
            cover_image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1000&auto=format&fit=crop",
        },
        {
            title_ar: "المرآة الملعونة",
            title_en: "The Cursed Mirror",
            slug: "the-cursed-mirror",
            excerpt_ar: "اشتريت مرآة قديمة من متجر التحف، لكنني سرعان ما اكتشفت أن انعكاسي يتحرك من تلقاء نفسه...",
            cover_image: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000&auto=format&fit=crop",
        },
        {
            title_ar: "فندق النهاية",
            title_en: "Hotel of the End",
            slug: "hotel-of-the-end",
            excerpt_ar: "غرفة رقم 404 لا تظهر في أي مخطط، ومن يدخلها لا يخرج أبداً...",
            cover_image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
        },
        {
            title_ar: "أصوات تحت السرير",
            title_en: "Voices Under the Bed",
            slug: "voices-under-the-bed",
            excerpt_ar: "كل ليلة أسمعهم يتهامسون، يخططون لشيء ما. الليلة، توقف الهمس وبدأ الخدش...",
            cover_image: "https://images.unsplash.com/photo-1626544827763-d516dce335ca?q=80&w=1000&auto=format&fit=crop",
        },
        {
            title_ar: "القطار الليلي",
            title_en: "The Night Train",
            slug: "the-night-train",
            excerpt_ar: "ركبت القطار الأخير إلى المنزل، لكن الركاب لم يكونوا بشراً، والمحطات لم تكن مألوفة...",
            cover_image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=1000&auto=format&fit=crop",
        }
    ];

    for (const s of sampleStories) {
        await prisma.story.upsert({
            where: { slug: s.slug },
            update: {},
            create: {
                ...s,
                body_markdown_ar: `# ${s.title_ar}\n\nقصة مرعبة...`,
                body_html_ar: `<h1>${s.title_ar}</h1><p>قصة مرعبة...</p>`,
                status: "published",
                author_id: admin.id,
                reading_time_min: 5,
            },
        });
    }

    console.log("Seeded stories");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
