# ToeicMate 🚀

เว็บแอปพลิเคชันสำหรับคนไทยที่กำลังเตรียมตัวสอบ TOEIC และต้องการพัฒนาทักษะการสื่อสารภาษาอังกฤษในที่ทำงานไปพร้อมกันอย่างมีประสิทธิภาพ เหมาะสำหรับคนทำงานและนักศึกษาที่มีเวลาเรียนวันละ 20–30 นาที และตั้งเป้าหมายคะแนน 700+

---

## 🌟 ฟีเจอร์หลัก (Key Features)

### โซน A: เตรียมสอบ TOEIC (Exam Mastery)
1. **คลังข้อสอบแยกตาม Part 1–7 (ชุดละ 10 ข้อ จับเวลา):**
   - มีระบบจำลองเวลาสอบเสมือนจริง (Countdown Timer)
   - **เฉลยละเอียดภาษาไทยทุกข้อ:** ชี้ชัดว่าทำไมคำตอบที่ถูกจึงถูกต้อง และ**อธิบายชัดเจนว่าทำไมตัวเลือกอื่นจึงผิด**
2. **Full Mock Test Simulation:**
   - โครงสร้างข้อสอบ 200 ข้อ (Listening 100 ข้อ + Reading 100 ข้อ) จับเวลา 2 ชั่วโมง
   - ระบบคำนวณและแปลงผลคะแนนประเมิน (Estimated Scaled Score 10–990)
3. **ระบบคำศัพท์อิงอัลกอริทึม Spaced Repetition (SM-2):**
   - หมวดหมู่คำศัพท์ตามบริบทข้อสอบจริง: Business Correspondence, Travel, Human Resources, Contracts
   - แฟลชการ์ด 3D Flip พร้อมออกเสียงผ่าน Web Speech API
   - ระบบประเมิน 4 ระดับ (ลืมสนิท / พอจำได้ / จำได้ / จำได้ดี) เพื่อตั้งรอบทบทวนอัตโนมัติ
4. **Grammar Drills เจาะจุดออกสอบบ่อยใน Part 5:**
   - Tense & Verb Forms, Prepositions & Collocations, Word Form / Part of Speech, Conjunctions & Transitions
5. **Dashboard วิเคราะห์จุดอ่อน:**
   - สถิติความแม่นยำราย Part (Radar Chart)
   - สตรีคความต่อเนื่อง (Daily Study Streak)
   - แนวโน้มคะแนนจากการทำแบบฝึกหัด (Score Trend Line Chart)
   - ปุ่มลัด **"เรียนวันนี้"** คำนวณแผน 20–30 นาทีให้อัตโนมัติ

### โซน B: การสื่อสารในที่ทำงาน (Workplace Communication)
6. **Phrase Bank — คลังประโยคสำเร็จรูปใช้งานจริง:**
   - แยกตามสถานการณ์: การประชุม (Meeting), เขียนอีเมล (Email), คุยโทรศัพท์ (Phone), นำเสนองาน (Presentation), สนทนาทั่วไป (Small Talk)
   - ปุ่มฟังเสียงอ่านออกเสียงภาษาอังกฤษผ่าน Web Speech API (TTS)
7. **Roleplay Chat กับ AI (Google Gemini API):**
   - จำลองบทบาทสนทนาจริง เช่น สัมภาษณ์งาน, คุยกับลูกค้าต่างชาติ, ขอปรับแก้ไทม์ไลน์
   - มีระบบ AI Coach ตรวจไวยากรณ์ ความเป็นธรรมชาติ และเสนอสำนวนที่ดีกว่า (Better Alternatives)
8. **Email Writing Practice:**
   - มีโจทย์สถานการณ์ทำงานจริง เช่น ขอเลื่อนประชุม, ขอใบเสนอราคา, ขออภัยกรณีส่งของล่าช้า
   - AI ตรวจร่างอีเมล วิเคราะห์จุดผิดเป็นข้อๆ และนำเสนออีเมลเวอร์ชันขัดเกลา (Polished Version)

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript + React 19
- **Styling:** Tailwind CSS + shadcn/ui + Lucide Icons + IBM Plex Sans Thai font
- **Database & ORM:** SQLite (รันเครื่องเดียวง่าย ไม่ต้องลง PostgreSQL เพิ่ม) ผ่าน Prisma ORM
- **Authentication:** NextAuth.js v5 (Credentials + Google OAuth)
- **Internationalization (i18n):** next-intl (ภาษาไทยเป็นค่าเริ่มต้น, สลับเป็นภาษาอังกฤษได้)
- **AI Engine:** Google Gemini API (`@google/genai` รุ่นล่าสุด `gemini-3.8-flash`)
- **Speech Audio:** Web Speech Synthesis API (TTS ในตัวเบราว์เซอร์ ใช้งานได้ฟรีทันที)

---

## 🚀 วิธีการติดตั้งและเริ่มใช้งาน (Getting Started)

### 1. ความต้องการเบื้องต้นของระบบ
- **Node.js** เวอร์ชัน 18.18+ หรือ 20+
- **npm** หรือ **yarn** หรือ **pnpm**

### 2. ติดตั้ง Dependencies
เปิด Terminal ในโฟลเดอร์ `toeicmate`:
```bash
cd toeicmate
npm install
```

### 3. ตั้งค่าไฟล์ Environment Variables (`.env`)
คัดลอกไฟล์ตัวอย่าง `.env.example` มาเป็น `.env`:
```bash
cp .env.example .env
```
ตรวจสอบค่าในไฟล์ `.env`:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="toeicmate-super-secret-key-32-chars-long"
NEXTAUTH_URL="http://localhost:3000"

# ใส่ Google Gemini API Key สำหรับระบบ Roleplay Chat และ Email Practice
GEMINI_API_KEY="AIzaSy..."

# (ทางเลือก) หากต้องการใช้งาน Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 4. ซิงค์ฐานข้อมูลและลงข้อมูลทดสอบ (Database Push & Seed)
รันคำสั่งเพื่อสร้างตาราง SQLite และ Seed ข้อมูลตัวอย่าง (Part 5 Questions 20 ข้อ + 30 คำศัพท์ + 20 ประโยคทำงาน + บัญชีทดสอบ):
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 5. รันเซิร์ฟเวอร์สำหรับทดสอบ (Development Server)
```bash
npm run dev
```
เปิดเบราว์เซอร์แล้วเข้าสู่: **[http://localhost:3000](http://localhost:3000)** ระบบจะ Redirect ไปที่หน้า **`/th/dashboard`**

---

## 🔑 บัญชีทดสอบสำหรับเข้าสู่ระบบ (Demo Account)

หลังจากรัน seed เรียบร้อยแล้ว สามารถเข้าสู่ระบบด้วยบัญชีตัวอย่างนี้ได้ทันที:
- **Email:** `seed@toeicmate.app`
- **Password:** `password123`
*(หรือสามารถกดสมัครสมาชิกใหม่ในหน้า `/th/register` ได้เลย)*

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```
toeicmate/
├── app/
│   ├── [locale]/
│   │   ├── (app)/
│   │   │   ├── dashboard/page.tsx      # แดชบอร์ดสรุปผลและจุดอ่อน
│   │   │   ├── quiz/                   # คลังข้อสอบ Part 1-7
│   │   │   │   └── [sessionId]/        # ห้องสอบ Focus Mode + เฉลย
│   │   │   ├── vocab/review/           # ทบทวนคำศัพท์ SRS (SM-2)
│   │   │   ├── grammar/                # เจาะจุด Grammar Part 5
│   │   │   ├── mock-test/              # สอบจำลอง Full Mock
│   │   │   ├── phrases/                # Phrase Bank พร้อมเสียงอ่าน
│   │   │   ├── roleplay/               # สนทนากับ AI Roleplay
│   │   │   └── email-practice/         # ฝึกเขียนอีเมลธุรกิจพร้อม AI ตรวจ
│   │   ├── (auth)/
│   │   │   ├── login/                  # หน้าเข้าสู่ระบบ
│   │   │   └── register/               # หน้าสมัครสมาชิก
│   │   └── layout.tsx
│   ├── api/
│   │   ├── ai/chat/                    # Gemini API Roleplay
│   │   ├── ai/email-feedback/          # Gemini API Email Review
│   │   ├── auth/                       # NextAuth endpoints
│   │   ├── dashboard/                  # Dashboard metrics API
│   │   ├── quiz/                       # Quiz creation, resume, submit
│   │   └── vocab/                      # SRS due & review rating
│   └── page.tsx                        # Root redirect
├── components/
│   ├── dashboard/                      # StreakWidget, Radar, ScoreTrend
│   ├── quiz/                           # QuestionCard, Timer, ExplanationPanel
│   ├── vocab/                          # FlashCard (3D Flip)
│   ├── layout/                         # Navbar, Sidebar
│   └── ui/                             # shadcn buttons, cards, progress
├── lib/
│   ├── auth.ts                         # NextAuth v5 config
│   ├── prisma.ts                       # Prisma Client singleton
│   ├── srs.ts                          # SM-2 Spaced Repetition Algorithm
│   ├── score-converter.ts              # ฟังก์ชันแปลงคะแนนดิบเป็น TOEIC Scaled Score
│   └── utils.ts
├── messages/                           # i18n Dictionary
│   ├── th.json                         # ภาษาไทย (Default)
│   └── en.json                         # ภาษาอังกฤษ
├── prisma/
│   ├── schema.prisma                   # Data models
│   └── seed.ts                         # 20 ข้อสอบ + 30 คำศัพท์ + 20 วลี
└── middleware.ts                       # ตรวจจับภาษาและ i18n routing
```

---

## ⚖️ ข้อสงวนสิทธิ์ทางกฎหมาย (Legal Disclaimer)
TOEIC® เป็นเครื่องหมายการค้าจดทะเบียนของ Educational Testing Service (ETS) ในสหรัฐอเมริกาและประเทศอื่นๆ เว็บแอปพลิเคชัน **ToeicMate** นี้จัดทำขึ้นเพื่อการศึกษาโดยอิสระ มิได้รับการรับรอง สนับสนุน หรือมีส่วนเกี่ยวข้องกับ ETS ใดๆ ทั้งสิ้น ข้อสอบและเนื้อหาทั้งหมดในแอปพลิเคชันนี้ได้รับการรังสรรค์ขึ้นใหม่ทั้งหมดตามโครงสร้างแนวทางข้อสอบมาตรฐาน
