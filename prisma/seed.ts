import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Part 5 Questions (20 ข้อ) ───────────────────────────────────────────
  const questions = [
    // TENSE (4 ข้อ)
    {
      part: 5,
      topic: 'tense',
      difficulty: 'medium',
      questionText: 'By the time the manager _____ the office, all the reports had already been submitted.',
      choices: JSON.stringify(['arrives', 'arrived', 'had arrived', 'will arrive']),
      answer: 1,
      explanationTh: 'คำตอบที่ถูกต้องคือ (B) arrived เพราะในประโยคนี้มี "By the time" ซึ่งบ่งบอกถึงเหตุการณ์ที่เกิดขึ้นก่อน ประกอบกับ main clause ใช้ Past Perfect (had been submitted) ดังนั้น by the time clause จึงต้องใช้ Simple Past\n\n❌ (A) arrives — Simple Present ใช้กับเหตุการณ์ปัจจุบัน ไม่เหมาะกับบริบทอดีต\n❌ (C) had arrived — Past Perfect ใช้เมื่อเหตุการณ์นั้นเกิดก่อนเหตุการณ์อื่นในอดีต แต่ใน by the time clause ไม่ใช้ Past Perfect ซ้ำกัน\n❌ (D) will arrive — Future tense ขัดกับบริบทอดีตทั้งประโยค',
      tags: 'past_perfect,by_the_time',
    },
    {
      part: 5,
      topic: 'tense',
      difficulty: 'medium',
      questionText: 'The company _____ its new product line next month at the annual trade fair.',
      choices: JSON.stringify(['launched', 'has launched', 'will be launching', 'had launched']),
      answer: 2,
      explanationTh: 'คำตอบที่ถูกต้องคือ (C) will be launching เพราะมีคำว่า "next month" บ่งชี้อนาคต และ Future Continuous เหมาะกับแผนการที่วางไว้และกำลังจะเกิดขึ้นในช่วงเวลาหนึ่ง\n\n❌ (A) launched — Simple Past ใช้กับอดีต ขัดกับ next month\n❌ (B) has launched — Present Perfect บ่งบอกว่าเสร็จสิ้นแล้ว ไม่สอดคล้องกับ next month\n❌ (D) had launched — Past Perfect ใช้กับเหตุการณ์อดีตก่อนอดีตอื่น ไม่เหมาะกับบริบทอนาคต',
      tags: 'future_continuous,future_plans',
    },
    {
      part: 5,
      topic: 'tense',
      difficulty: 'hard',
      questionText: 'Our team _____ on this project for three years before the client finally approved the design.',
      choices: JSON.stringify(['works', 'worked', 'had been working', 'has been working']),
      answer: 2,
      explanationTh: 'คำตอบที่ถูกต้องคือ (C) had been working เพราะมีสองเหตุการณ์ในอดีต — การทำงานต่อเนื่อง (เกิดก่อน) และการ approve (เกิดหลัง) Past Perfect Continuous แสดงการกระทำที่ต่อเนื่องในอดีตก่อนจุดเวลาในอดีตอีกจุด\n\n❌ (A) works — Simple Present ไม่เหมาะกับบริบทอดีต\n❌ (B) worked — Simple Past ไม่แสดงความต่อเนื่องหรือลำดับเวลาก่อน-หลัง\n❌ (D) has been working — Present Perfect Continuous บ่งบอกว่ายังทำอยู่จนถึงปัจจุบัน ขัดกับ "finally approved" ที่บ่งชี้ว่าจบแล้ว',
      tags: 'past_perfect_continuous',
    },
    {
      part: 5,
      topic: 'tense',
      difficulty: 'easy',
      questionText: 'Every morning, the supervisor _____ a brief meeting with the team before work begins.',
      choices: JSON.stringify(['holds', 'held', 'is holding', 'will hold']),
      answer: 0,
      explanationTh: 'คำตอบที่ถูกต้องคือ (A) holds เพราะ "Every morning" บ่งชี้ routine หรือนิสัยประจำ ต้องใช้ Simple Present\n\n❌ (B) held — Simple Past ใช้กับเหตุการณ์ที่จบไปแล้ว\n❌ (C) is holding — Present Continuous ใช้กับเหตุการณ์ที่กำลังเกิดขึ้น ณ ขณะพูด ไม่ใช่กิจวัตร\n❌ (D) will hold — Future ไม่เหมาะกับกิจวัตรประจำวัน',
      tags: 'simple_present,routine',
    },

    // PREPOSITION (4 ข้อ)
    {
      part: 5,
      topic: 'preposition',
      difficulty: 'medium',
      questionText: 'The conference room is available _____ reservation only, so please book in advance.',
      choices: JSON.stringify(['by', 'on', 'at', 'for']),
      answer: 0,
      explanationTh: 'คำตอบที่ถูกต้องคือ (A) by เพราะ "by reservation only" เป็น fixed phrase แปลว่า "ต้องจองเท่านั้น" ใช้ by แสดงวิธีการหรือเงื่อนไข\n\n❌ (B) on — on reservation ไม่ใช่ collocation ที่ถูกต้อง\n❌ (C) at — at reservation ไม่มีความหมายในบริบทนี้\n❌ (D) for — for reservation ฟังดูคล้ายแต่ไม่ใช่ fixed expression ที่ถูกต้อง',
      tags: 'fixed_phrase,by',
    },
    {
      part: 5,
      topic: 'preposition',
      difficulty: 'medium',
      questionText: 'The sales figures were _____ expectations, prompting the board to issue a bonus.',
      choices: JSON.stringify(['above', 'over', 'beyond', 'ahead']),
      answer: 2,
      explanationTh: 'คำตอบที่ถูกต้องคือ (C) beyond เพราะ "beyond expectations" เป็น idiomatic expression หมายถึง "เกินความคาดหมาย" เน้นความเหนือกว่าอย่างมาก\n\n❌ (A) above — above expectations ใช้ได้แต่ในบริบทนี้ beyond เป็นธรรมชาติกว่า และตัวเลือก beyond ตรงกว่า\n❌ (B) over — over expectations ไม่เป็น natural collocation\n❌ (D) ahead — ahead of expectations ต้องใช้ of ตาม ถ้าไม่มี of จะไม่ถูก',
      tags: 'idiom,beyond,expectations',
    },
    {
      part: 5,
      topic: 'preposition',
      difficulty: 'easy',
      questionText: 'Please submit your application _____ email or in person at the HR office.',
      choices: JSON.stringify(['through', 'via', 'by', 'with']),
      answer: 1,
      explanationTh: 'คำตอบที่ถูกต้องคือ (B) via เพราะ via email หมายถึง "ผ่านทางอีเมล" เป็น preposition ที่นิยมใช้กับช่องทางการส่ง\n\n❌ (A) through — through email ใช้ได้ในบางบริบท แต่ via email เป็นธรรมชาติกว่าในภาษาธุรกิจ\n❌ (C) by — by email ก็ใช้ได้ แต่ in this parallel structure กับ "in person" ทำให้ via เหมาะกว่า\n❌ (D) with — with email ไม่ใช่ preposition ที่ถูกต้องในบริบทนี้',
      tags: 'via,by,channel',
    },
    {
      part: 5,
      topic: 'preposition',
      difficulty: 'hard',
      questionText: 'The policy is _____ effect as of January 1st and applies to all employees.',
      choices: JSON.stringify(['in', 'on', 'under', 'into']),
      answer: 0,
      explanationTh: 'คำตอบที่ถูกต้องคือ (A) in เพราะ "in effect" เป็น fixed phrase หมายถึง "มีผลบังคับใช้" \n\n❌ (B) on — on effect ไม่ใช่ fixed phrase ที่ถูกต้อง\n❌ (C) under — under effect มักใช้กับ under the effect of (ภายใต้ผลของ) ซึ่งต่างบริบท\n❌ (D) into — into effect ใช้กับ come into effect (เริ่มมีผล) แต่ในประโยคนี้ is + เหมาะกับ in effect ไม่ใช่ into effect',
      tags: 'fixed_phrase,in_effect',
    },

    // WORD FORM (6 ข้อ)
    {
      part: 5,
      topic: 'word_form',
      difficulty: 'easy',
      questionText: 'The new policy has received widespread _____ from employees across all departments.',
      choices: JSON.stringify(['approve', 'approval', 'approving', 'approved']),
      answer: 1,
      explanationTh: 'คำตอบที่ถูกต้องคือ (B) approval (noun) เพราะหลัง received ต้องการ noun เป็น object\n\n❌ (A) approve — กริยา ไม่ใช่ noun\n❌ (C) approving — present participle หรือ adjective ไม่ใช่ noun ที่ทำหน้าที่ object\n❌ (D) approved — past participle/adjective ไม่ใช่ noun',
      tags: 'noun_form,derivation',
    },
    {
      part: 5,
      topic: 'word_form',
      difficulty: 'medium',
      questionText: "The consultant provided _____ advice on restructuring the company's supply chain.",
      choices: JSON.stringify(['value', 'valuable', 'valuably', 'valued']),
      answer: 1,
      explanationTh: 'คำตอบที่ถูกต้องคือ (B) valuable (adjective) เพราะตำแหน่งก่อน noun (advice) ต้องการ adjective\n\n❌ (A) value — noun หรือ verb ไม่ใช่ adjective\n❌ (C) valuably — adverb ใช้ขยาย verb หรือ adjective ไม่ใช่ noun\n❌ (D) valued — มีความหมายว่า "ที่ถูกให้คุณค่า" ซึ่งต่างบริบทกับ valuable (=มีคุณค่า)',
      tags: 'adjective_form,pre_nominal',
    },
    {
      part: 5,
      topic: 'word_form',
      difficulty: 'medium',
      questionText: 'All staff members must complete the training _____ before starting their new roles.',
      choices: JSON.stringify(['mandatory', 'mandatorily', 'mandate', 'mandated']),
      answer: 0,
      explanationTh: 'คำตอบที่ถูกต้องคือ (A) mandatory (adjective) เพราะขยาย noun (training) จึงต้องเป็น adjective\n\n❌ (B) mandatorily — adverb ขยาย verb ไม่ขยาย noun\n❌ (C) mandate — noun หรือ verb ไม่ใช่ adjective\n❌ (D) mandated — past participle/adjective มีความหมายว่า "ถูกสั่งการ" ใช้ได้บ้าง แต่ mandatory เหมาะกว่าเพราะหมายถึง "บังคับ"',
      tags: 'adjective_form,mandatory',
    },
    {
      part: 5,
      topic: 'word_form',
      difficulty: 'hard',
      questionText: 'The _____ of the new software will significantly improve productivity in all departments.',
      choices: JSON.stringify(['implement', 'implementation', 'implemented', 'implementing']),
      answer: 1,
      explanationTh: 'คำตอบที่ถูกต้องคือ (B) implementation (noun) เพราะเป็น subject ของประโยค จึงต้องเป็น noun\n\n❌ (A) implement — กริยา ถ้าใช้เป็น noun จะหมายถึง "เครื่องมือ" ซึ่งต่างบริบท\n❌ (C) implemented — past participle ไม่ทำหน้าที่เป็น subject ได้โดยตรง\n❌ (D) implementing — ถ้าเป็น gerund ใช้เป็น subject ได้ แต่ต้องการ object (implementing what?) ทำให้ implementation เหมาะกว่า',
      tags: 'noun_form,subject_position',
    },
    {
      part: 5,
      topic: 'word_form',
      difficulty: 'medium',
      questionText: 'The project manager spoke _____ about the delays caused by the supplier.',
      choices: JSON.stringify(['frank', 'frankly', 'frankness', 'franker']),
      answer: 1,
      explanationTh: 'คำตอบที่ถูกต้องคือ (B) frankly (adverb) เพราะขยาย verb (spoke) ต้องใช้ adverb\n\n❌ (A) frank — adjective ขยาย noun ไม่ขยาย verb\n❌ (C) frankness — noun ไม่ทำหน้าที่ขยาย verb\n❌ (D) franker — comparative adjective ใช้กับ noun ไม่ใช่ verb',
      tags: 'adverb_form,verb_modifier',
    },
    {
      part: 5,
      topic: 'word_form',
      difficulty: 'easy',
      questionText: 'Her _____ presentation impressed the investors and secured additional funding.',
      choices: JSON.stringify(['exception', 'exceptional', 'exceptionally', 'excepting']),
      answer: 1,
      explanationTh: 'คำตอบที่ถูกต้องคือ (B) exceptional (adjective) เพราะขยาย noun (presentation)\n\n❌ (A) exception — noun ไม่ใช่ adjective\n❌ (C) exceptionally — adverb ขยาย adjective หรือ verb ไม่ขยาย noun\n❌ (D) excepting — preposition/conjunction แปลว่า "ยกเว้น" ต่างบริบท',
      tags: 'adjective_form,pre_nominal',
    },

    // CONJUNCTION (6 ข้อ)
    {
      part: 5,
      topic: 'conjunction',
      difficulty: 'easy',
      questionText: 'The project was completed on time _____ the team faced numerous unexpected challenges.',
      choices: JSON.stringify(['because', 'although', 'so that', 'unless']),
      answer: 1,
      explanationTh: 'คำตอบที่ถูกต้องคือ (B) although เพราะแสดง contrast ระหว่าง "งานเสร็จทันเวลา" กับ "มีปัญหาหลายอย่าง"\n\n❌ (A) because — แสดงเหตุ จะทำให้ประโยคแปลว่า "เสร็จทันเพราะมีปัญหา" ซึ่งไม่สมเหตุ\n❌ (C) so that — แสดงวัตถุประสงค์ ไม่เหมาะกับบริบทนี้\n❌ (D) unless — แสดงเงื่อนไขเชิงลบ ไม่เหมาะกับบริบทนี้',
      tags: 'contrast,although,concession',
    },
    {
      part: 5,
      topic: 'conjunction',
      difficulty: 'medium',
      questionText: '_____ the budget is approved, the team can begin the renovation immediately.',
      choices: JSON.stringify(['Because', 'Unless', 'Once', 'Even though']),
      answer: 2,
      explanationTh: 'คำตอบที่ถูกต้องคือ (C) Once เพราะแสดงว่า "เมื่อ... เกิดขึ้น" ซึ่งเป็นเงื่อนไขที่คาดหวังจะเกิด แล้วผลจึงตามมา\n\n❌ (A) Because — แสดงเหตุ แต่งบประมาณยังไม่ถูก approve ยังไม่ใช่เหตุ\n❌ (B) Unless — หมายถึง "ถ้าไม่" ทำให้ประโยคกลายเป็น "ถ้าไม่ได้รับอนุมัติก็จะเริ่ม" ซึ่งขัดแย้งในตัว\n❌ (D) Even though — แสดง contrast ไม่เหมาะกับบริบทเงื่อนไข',
      tags: 'condition,once,time_clause',
    },
    {
      part: 5,
      topic: 'conjunction',
      difficulty: 'medium',
      questionText: 'The CEO gave his approval, _____ the legal team still needs to review the contract.',
      choices: JSON.stringify(['and', 'but', 'so', 'for']),
      answer: 1,
      explanationTh: 'คำตอบที่ถูกต้องคือ (B) but เพราะเชื่อม 2 ประโยคที่มีความหมายขัดกัน (CEO approve แล้ว แต่ legal team ยังต้องดูอีก)\n\n❌ (A) and — เชื่อมสองสิ่งในทิศทางเดียวกัน ไม่เหมาะกับ contrast\n❌ (C) so — แสดงผลลัพธ์ ถ้าใช้จะแปลว่า CEO approve ดังนั้น legal team ต้องดูซึ่งไม่ไหลเป็นธรรมชาติ\n❌ (D) for — conjunction แสดงเหตุ (เพราะว่า) ไม่เหมาะกับบริบทนี้',
      tags: 'coordinating_conjunction,contrast',
    },
    {
      part: 5,
      topic: 'conjunction',
      difficulty: 'hard',
      questionText: 'The marketing team must decide _____ to expand to new markets or focus on existing customers.',
      choices: JSON.stringify(['if', 'whether', 'that', 'what']),
      answer: 1,
      explanationTh: 'คำตอบที่ถูกต้องคือ (B) whether เพราะ whether...or... เป็น structure มาตรฐานเมื่อนำเสนอสองทางเลือก\n\n❌ (A) if — if...or... ไม่ใช่ structure ที่ถูกต้อง if ใช้คู่กับ then หรือใช้ในคำถามทางอ้อมที่ไม่มี or\n❌ (C) that — that + clause ไม่ใช้กับโครงสร้าง or ในแบบนี้\n❌ (D) what — what + to-infinitive แสดงการถามว่า "อะไร" ไม่ใช่ "อันไหนในสองอย่าง"',
      tags: 'whether_or,indirect_question',
    },
    {
      part: 5,
      topic: 'conjunction',
      difficulty: 'hard',
      questionText: 'We will proceed with the launch _____ all quality checks have been completed satisfactorily.',
      choices: JSON.stringify(['provided that', 'in spite of', 'regardless of', 'instead of']),
      answer: 0,
      explanationTh: 'คำตอบที่ถูกต้องคือ (A) provided that เพราะแสดงเงื่อนไข หมายถึง "โดยมีเงื่อนไขว่า" ซึ่งสอดคล้องกับบริบทที่ต้องทำ quality checks ก่อนจึง launch ได้\n\n❌ (B) in spite of — แสดง contrast, ต้องการ noun/gerund ตาม ไม่ใช่ clause\n❌ (C) regardless of — หมายถึง "ไม่ว่าจะ..." ขัดกับความหมายที่ต้องการเงื่อนไข\n❌ (D) instead of — แสดงการแทนที่ ไม่เหมาะกับบริบทเงื่อนไข',
      tags: 'conditional,provided_that',
    },
    {
      part: 5,
      topic: 'conjunction',
      difficulty: 'medium',
      questionText: 'The seminar was postponed _____ the main speaker was unable to attend due to illness.',
      choices: JSON.stringify(['because', 'despite', 'whereas', 'whenever']),
      answer: 0,
      explanationTh: 'คำตอบที่ถูกต้องคือ (A) because เพราะแสดงเหตุ (เลื่อนเพราะวิทยากรหลักมาไม่ได้)\n\n❌ (B) despite — แสดง contrast, ต้องการ noun/gerund phrase ตาม ไม่ใช่ clause ที่มี subject+verb\n❌ (C) whereas — แสดงความแตกต่างระหว่างสองสิ่ง ไม่แสดงเหตุ\n❌ (D) whenever — แสดงทุกครั้งที่...เกิดขึ้น ไม่เหมาะกับเหตุการณ์เฉพาะครั้ง',
      tags: 'cause_effect,because',
    },
  ];

  const existingQuestions = await prisma.question.count();
  if (existingQuestions === 0) {
    for (const q of questions) {
      await prisma.question.create({ data: q });
    }
    console.log(`✅ Created ${questions.length} questions`);
  } else {
    console.log(`ℹ️ Questions already seeded (${existingQuestions} questions exist)`);
  }

  // ─── Vocab Cards (30 คำ) ──────────────────────────────────────────────────
  // สร้างเป็น global cards (ไม่มี userId — เป็น template)
  // NOTE: VocabCard ต้องการ userId จริง ดังนั้นเราสร้าง seed user ก่อน
  let seedUser = await prisma.user.findFirst({ where: { email: 'seed@toeicmate.app' } });
  const passwordHash = await bcrypt.hash('password123', 10);
  if (!seedUser) {
    seedUser = await prisma.user.create({
      data: {
        email: 'seed@toeicmate.app',
        name: 'Seed User',
        passwordHash,
        provider: 'credentials',
        targetScore: 750,
        currentScore: 550,
      },
    });
  } else if (!seedUser.passwordHash) {
    await prisma.user.update({
      where: { id: seedUser.id },
      data: { passwordHash },
    });
  }

  const vocabData = [
    // Business Correspondence (10)
    { term: 'acknowledge', phonetic: '/ækˈnɒlɪdʒ/', meaningTh: 'รับทราบ, ยืนยันการได้รับ', exampleEn: 'Please acknowledge receipt of this email.', exampleTh: 'กรุณายืนยันการได้รับอีเมลนี้', category: 'Business Correspondence' },
    { term: 'pursuant to', phonetic: '/pərˈsuːənt tuː/', meaningTh: 'ตามที่ระบุไว้ใน, ตามข้อตกลง', exampleEn: 'Pursuant to our agreement, payment is due on the 15th.', exampleTh: 'ตามข้อตกลงของเรา การชำระเงินครบกำหนดในวันที่ 15', category: 'Business Correspondence' },
    { term: 'enclosed', phonetic: '/ɪnˈkloʊzd/', meaningTh: 'แนบมาด้วย', exampleEn: 'Please find enclosed the signed contract.', exampleTh: 'กรุณาดูสัญญาที่ลงนามแล้วซึ่งแนบมาด้วย', category: 'Business Correspondence' },
    { term: 'expedite', phonetic: '/ˈekspɪdaɪt/', meaningTh: 'เร่ง, ดำเนินการให้รวดเร็วขึ้น', exampleEn: 'We need to expedite the delivery to meet the deadline.', exampleTh: 'เราต้องเร่งการจัดส่งเพื่อให้ทันกำหนด', category: 'Business Correspondence' },
    { term: 'tentative', phonetic: '/ˈtentətɪv/', meaningTh: 'เบื้องต้น, ยังไม่แน่นอน', exampleEn: 'We have set a tentative date for the meeting.', exampleTh: 'เราได้กำหนดวันประชุมเบื้องต้นไว้แล้ว', category: 'Business Correspondence' },
    { term: 'clarify', phonetic: '/ˈklærɪfaɪ/', meaningTh: 'ชี้แจง, ทำให้ชัดเจน', exampleEn: 'Could you clarify the terms of the proposal?', exampleTh: 'คุณช่วยชี้แจงเงื่อนไขของข้อเสนอได้ไหม', category: 'Business Correspondence' },
    { term: 'on behalf of', phonetic: '/ɒn bɪˈhɑːf ɒv/', meaningTh: 'ในนามของ, แทน', exampleEn: 'I am writing on behalf of our CEO.', exampleTh: 'ฉันเขียนในนามของซีอีโอของเรา', category: 'Business Correspondence' },
    { term: 'remittance', phonetic: '/rɪˈmɪtəns/', meaningTh: 'การส่งเงิน, การชำระเงิน', exampleEn: 'The remittance will be processed within 3 business days.', exampleTh: 'การโอนเงินจะดำเนินการภายใน 3 วันทำการ', category: 'Business Correspondence' },
    { term: 'invoice', phonetic: '/ˈɪnvɔɪs/', meaningTh: 'ใบแจ้งหนี้, ใบกำกับสินค้า', exampleEn: 'Please send us your invoice for the completed work.', exampleTh: 'กรุณาส่งใบแจ้งหนี้สำหรับงานที่เสร็จแล้วมาให้เรา', category: 'Business Correspondence' },
    { term: 'discrepancy', phonetic: '/dɪˈskrepənsi/', meaningTh: 'ความไม่สอดคล้อง, ความแตกต่างที่ผิดพลาด', exampleEn: 'There is a discrepancy between the invoice and the purchase order.', exampleTh: 'มีความไม่สอดคล้องระหว่างใบแจ้งหนี้กับใบสั่งซื้อ', category: 'Business Correspondence' },

    // Travel (10)
    { term: 'itinerary', phonetic: '/aɪˈtɪnərəri/', meaningTh: 'กำหนดการเดินทาง, แผนการเดินทาง', exampleEn: 'Please review the travel itinerary before the trip.', exampleTh: 'กรุณาตรวจสอบกำหนดการเดินทางก่อนออกเดินทาง', category: 'Travel' },
    { term: 'layover', phonetic: '/ˈleɪoʊvər/', meaningTh: 'การต่อเครื่อง, เวลาแวะพัก', exampleEn: 'We have a three-hour layover in Singapore.', exampleTh: 'เรามีเวลาต่อเครื่อง 3 ชั่วโมงที่สิงคโปร์', category: 'Travel' },
    { term: 'reimburse', phonetic: '/ˌriːɪmˈbɜːrs/', meaningTh: 'คืนเงิน, ชดใช้', exampleEn: 'The company will reimburse all travel expenses.', exampleTh: 'บริษัทจะคืนเงินค่าใช้จ่ายการเดินทางทั้งหมด', category: 'Travel' },
    { term: 'accommodation', phonetic: '/əˌkɒməˈdeɪʃən/', meaningTh: 'ที่พัก', exampleEn: 'The accommodation has been booked near the conference venue.', exampleTh: 'ที่พักได้รับการจองใกล้กับสถานที่จัดงานประชุม', category: 'Travel' },
    { term: 'transit visa', phonetic: '/ˈtrænsɪt ˈviːzə/', meaningTh: 'วีซ่าผ่านแดน', exampleEn: 'You may need a transit visa even for a short stopover.', exampleTh: 'คุณอาจต้องใช้วีซ่าผ่านแดนแม้จะแวะเพียงสั้นๆ', category: 'Travel' },
    { term: 'per diem', phonetic: '/pər ˈdiːəm/', meaningTh: 'ค่าเบี้ยเลี้ยงรายวัน', exampleEn: 'The per diem for the conference is $80 per day.', exampleTh: 'ค่าเบี้ยเลี้ยงสำหรับการประชุมคือ 80 ดอลลาร์ต่อวัน', category: 'Travel' },
    { term: 'baggage allowance', phonetic: '/ˈbæɡɪdʒ əˈlaʊəns/', meaningTh: 'น้ำหนักกระเป๋าที่อนุญาต', exampleEn: 'Business class passengers have a larger baggage allowance.', exampleTh: 'ผู้โดยสารชั้นธุรกิจมีน้ำหนักกระเป๋าที่อนุญาตมากกว่า', category: 'Travel' },
    { term: 'customs declaration', phonetic: '/ˈkʌstəmz ˌdekləˈreɪʃən/', meaningTh: 'การแจ้งศุลกากร', exampleEn: 'Fill out the customs declaration form upon arrival.', exampleTh: 'กรอกแบบฟอร์มศุลกากรเมื่อเดินทางมาถึง', category: 'Travel' },
    { term: 'complimentary', phonetic: '/ˌkɒmplɪˈmentəri/', meaningTh: 'ให้ฟรี, ของที่ให้เป็นของขวัญ', exampleEn: 'Breakfast is complimentary for all hotel guests.', exampleTh: 'อาหารเช้าให้บริการฟรีสำหรับแขกทุกท่าน', category: 'Travel' },
    { term: 'ground transportation', phonetic: '/ɡraʊnd ˌtrænspɔːˈteɪʃən/', meaningTh: 'การเดินทางทางบก, การขนส่งภาคพื้นดิน', exampleEn: 'The hotel provides complimentary ground transportation from the airport.', exampleTh: 'โรงแรมให้บริการรถรับส่งฟรีจากสนามบิน', category: 'Travel' },

    // HR (10)
    { term: 'probationary period', phonetic: '/prəˈbeɪʃənəri ˈpɪəriəd/', meaningTh: 'ช่วงทดลองงาน', exampleEn: 'The probationary period lasts for three months.', exampleTh: 'ช่วงทดลองงานมีระยะเวลา 3 เดือน', category: 'HR' },
    { term: 'severance pay', phonetic: '/ˈsevərəns peɪ/', meaningTh: 'ค่าชดเชยการเลิกจ้าง', exampleEn: 'Employees are entitled to severance pay after five years of service.', exampleTh: 'พนักงานมีสิทธิ์ได้รับค่าชดเชยหลังทำงานครบ 5 ปี', category: 'HR' },
    { term: 'performance appraisal', phonetic: '/pəˈfɔːrməns əˈpreɪzəl/', meaningTh: 'การประเมินผลการปฏิบัติงาน', exampleEn: 'Annual performance appraisals are conducted in December.', exampleTh: 'การประเมินผลงานประจำปีจะดำเนินการในเดือนธันวาคม', category: 'HR' },
    { term: 'exempt', phonetic: '/ɪɡˈzempt/', meaningTh: 'ได้รับการยกเว้น', exampleEn: 'Senior managers are exempt from overtime pay regulations.', exampleTh: 'ผู้จัดการอาวุโสได้รับการยกเว้นจากกฎการจ่ายค่าล่วงเวลา', category: 'HR' },
    { term: 'onboarding', phonetic: '/ˈɒnbɔːrdɪŋ/', meaningTh: 'กระบวนการต้อนรับและปฐมนิเทศพนักงานใหม่', exampleEn: 'The onboarding process takes approximately two weeks.', exampleTh: 'กระบวนการต้อนรับพนักงานใหม่ใช้เวลาประมาณสองสัปดาห์', category: 'HR' },
    { term: 'attrition', phonetic: '/əˈtrɪʃən/', meaningTh: 'การลดลงของพนักงานโดยธรรมชาติ (ลาออก เกษียณ)', exampleEn: 'The company plans to reduce headcount through natural attrition.', exampleTh: 'บริษัทวางแผนลดจำนวนพนักงานผ่านการลาออกตามธรรมชาติ', category: 'HR' },
    { term: 'grievance', phonetic: '/ˈɡriːvəns/', meaningTh: 'ข้อร้องเรียน, ความไม่พอใจ', exampleEn: 'Employees can file a grievance through the HR department.', exampleTh: 'พนักงานสามารถยื่นข้อร้องเรียนผ่านฝ่าย HR ได้', category: 'HR' },
    { term: 'headhunting', phonetic: '/ˈhedhʌntɪŋ/', meaningTh: 'การสรรหาผู้บริหารระดับสูง', exampleEn: 'The firm used headhunting to find a new CFO.', exampleTh: 'บริษัทใช้วิธีสรรหาบุคลากรเพื่อหา CFO คนใหม่', category: 'HR' },
    { term: 'non-disclosure agreement', phonetic: '/nɒn dɪsˈkloʊʒər əˈɡriːmənt/', meaningTh: 'สัญญาไม่เปิดเผยข้อมูล (NDA)', exampleEn: 'All contractors must sign a non-disclosure agreement.', exampleTh: 'ผู้รับเหมาทุกคนต้องลงนามในสัญญาไม่เปิดเผยข้อมูล', category: 'HR' },
    { term: 'redundancy', phonetic: '/rɪˈdʌndənsi/', meaningTh: 'การเลิกจ้างเนื่องจากตำแหน่งงานไม่จำเป็นอีกต่อไป', exampleEn: 'The restructuring led to several redundancies in the marketing team.', exampleTh: 'การปรับโครงสร้างนำไปสู่การเลิกจ้างหลายตำแหน่งในทีมการตลาด', category: 'HR' },
  ];

  const existingVocab = await prisma.vocabCard.count({ where: { userId: seedUser.id } });
  if (existingVocab === 0) {
    for (const v of vocabData) {
      await prisma.vocabCard.create({
        data: { ...v, userId: seedUser.id },
      });
    }
    console.log(`✅ Created ${vocabData.length} vocab cards`);
  } else {
    console.log(`ℹ️ Vocab cards already seeded (${existingVocab} cards exist)`);
  }

  // ─── Phrase Items (20 ประโยค) ──────────────────────────────────────────────
  const phrases = [
    // MEETING (5)
    { situation: 'MEETING', phraseEn: "Let's get started, shall we?", phraseTh: 'เริ่มกันเลยนะครับ/ครับ', notes: 'ใช้เปิดประชุมอย่างเป็นมิตร' },
    { situation: 'MEETING', phraseEn: "I'd like to bring up a concern regarding the timeline.", phraseTh: 'ผม/ดิฉันอยากหยิบยกเรื่องกำหนดเวลามาพูดถึง', notes: 'สุภาพกว่า "I want to talk about"' },
    { situation: 'MEETING', phraseEn: 'Could we table this item for the next meeting?', phraseTh: 'เราสามารถเลื่อนหัวข้อนี้ไปประชุมครั้งหน้าได้ไหม', notes: 'table = เลื่อน (American English) ระวังความหมายต่างกับ British English' },
    { situation: 'MEETING', phraseEn: "To summarize, we've agreed to move forward with option B.", phraseTh: 'สรุปแล้ว เราตกลงที่จะดำเนินการตามทางเลือก B', notes: 'ใช้ก่อนปิดประเด็น' },
    { situation: 'MEETING', phraseEn: 'Can we put that in the minutes?', phraseTh: 'เราสามารถบันทึกเรื่องนั้นในรายงานการประชุมได้ไหม', notes: 'minutes = รายงานการประชุม' },

    // EMAIL (5)
    { situation: 'EMAIL', phraseEn: 'I hope this email finds you well.', phraseTh: 'หวังว่าคุณสบายดีนะครับ/ค่ะ', notes: 'ทักทายเปิดอีเมลอย่างสุภาพ' },
    { situation: 'EMAIL', phraseEn: 'I am writing to follow up on our previous conversation.', phraseTh: 'ฉันเขียนมาเพื่อติดตามผลการสนทนาครั้งก่อนของเรา', notes: 'ใช้ติดตามเรื่องที่ค้างไว้' },
    { situation: 'EMAIL', phraseEn: 'Please do not hesitate to contact me if you have any questions.', phraseTh: 'หากมีคำถามใดๆ อย่าลังเลที่จะติดต่อฉันนะครับ/ค่ะ', notes: 'ปิดท้ายอีเมลอย่างมืออาชีพ' },
    { situation: 'EMAIL', phraseEn: 'I would appreciate a prompt response at your earliest convenience.', phraseTh: 'จะขอบคุณมากหากได้รับการตอบกลับโดยเร็วตามความสะดวกของคุณ', notes: 'ขอให้ตอบเร็วโดยไม่กดดัน' },
    { situation: 'EMAIL', phraseEn: 'Kindly refer to the attached document for further details.', phraseTh: 'กรุณาดูเอกสารที่แนบมาสำหรับรายละเอียดเพิ่มเติม', notes: 'สุภาพกว่า "See the attachment"' },

    // PHONE (4)
    { situation: 'PHONE', phraseEn: "I'm afraid he's in a meeting right now. May I take a message?", phraseTh: 'เขาอยู่ในการประชุมขณะนี้ครับ/ค่ะ ขอรับฝากข้อความได้ไหม', notes: 'ตอบรับโทรศัพท์แทนเพื่อนร่วมงาน' },
    { situation: 'PHONE', phraseEn: 'Could you speak up a little? The line is not very clear.', phraseTh: 'คุณช่วยพูดดังขึ้นหน่อยได้ไหม สัญญาณไม่ค่อยดี', notes: 'ขอให้พูดดังขึ้นอย่างสุภาพ' },
    { situation: 'PHONE', phraseEn: 'Let me put you on hold for just a moment.', phraseTh: 'ขอให้คุณรอสักครู่นะครับ/ค่ะ', notes: 'ขอพักสายชั่วคราว' },
    { situation: 'PHONE', phraseEn: "I'll have her call you back as soon as possible.", phraseTh: 'ฉันจะให้เธอโทรกลับหาคุณโดยเร็วที่สุด', notes: 'รับปากฝากโทรกลับ' },

    // PRESENTATION (3)
    { situation: 'PRESENTATION', phraseEn: 'If you could direct your attention to this slide...', phraseTh: 'หากคุณช่วยดูที่สไลด์นี้...', notes: 'ดึงความสนใจไปยังสไลด์' },
    { situation: 'PRESENTATION', phraseEn: 'The data clearly indicates that...', phraseTh: 'ข้อมูลชี้ให้เห็นอย่างชัดเจนว่า...', notes: 'ใช้อ้างอิงสถิติ' },
    { situation: 'PRESENTATION', phraseEn: "I'd be happy to elaborate on that point if needed.", phraseTh: 'ยินดีที่จะอธิบายประเด็นนั้นเพิ่มเติมถ้าต้องการ', notes: 'เปิดโอกาสให้ถามหลัง present' },

    // SMALLTALK (3)
    { situation: 'SMALLTALK', phraseEn: "It's been a busy week, hasn't it?", phraseTh: 'สัปดาห์นี้วุ่นมากเลยนะ', notes: 'tag question ใช้เริ่มบทสนทนา' },
    { situation: 'SMALLTALK', phraseEn: 'Did you catch the game last night?', phraseTh: 'ดูเกมเมื่อคืนไหม', notes: 'สำนวนพูดถึงการดูกีฬา' },
    { situation: 'SMALLTALK', phraseEn: 'It was great catching up with you!', phraseTh: 'ดีใจมากที่ได้คุยกันอีกครั้ง', notes: 'ปิดบทสนทนาอย่างอบอุ่น' },
  ];

  const existingPhrases = await prisma.phraseItem.count();
  if (existingPhrases === 0) {
    for (const p of phrases) {
      await prisma.phraseItem.create({ data: p });
    }
    console.log(`✅ Created ${phrases.length} phrases`);
  } else {
    console.log(`ℹ️ Phrases already seeded (${existingPhrases} phrases exist)`);
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
