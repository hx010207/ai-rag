import json
import random
from typing import List, Dict, Any

# Curated dataset passages representing MSMARCO-XI passages in Indic languages + English
MSMARCO_XI_SAMPLE_DATA: List[Dict[str, Any]] = [
    {
        "query_id": "q_hi_001",
        "language": "hi",
        "query": "भारत की राजधानी क्या है और इसकी जनसंख्या कितनी है?",
        "passage_id": "pass_hi_001",
        "passage_text": "नई दिल्ली भारत की राजधानी है और यह राष्ट्रीय राजधानी क्षेत्र (NCT) का हिस्सा है। 2021 के अनुमानों के अनुसार, दिल्ली मेट्रोपॉलिटन क्षेत्र की जनसंख्या लगभग 31 मिलियन (3.1 करोड़) है, जो इसे दुनिया के सबसे बड़े शहरी क्षेत्रों में से एक बनाती है।",
        "is_selected": 1,
        "well_formed_answer": "नई दिल्ली भारत की राजधानी है और इसकी मेट्रोपॉलिटन जनसंख्या लगभग 31 मिलियन है।"
    },
    {
        "query_id": "q_hi_002",
        "language": "hi",
        "query": "प्रकाश संश्लेषण की प्रक्रिया क्या है?",
        "passage_id": "pass_hi_002",
        "passage_text": "प्रकाश संश्लेषण (Photosynthesis) वह प्रक्रिया है जिसके द्वारा हरे पौधे सूर्य के प्रकाश, जल और कार्बन डाइऑक्साइड का उपयोग करके ग्लूकोज और ऑक्सीजन का निर्माण करते हैं। यह प्रक्रिया पौधों की पत्तियों में मौजूद क्लोरोफिल में होती है।",
        "is_selected": 1,
        "well_formed_answer": "प्रकाश संश्लेषण वह प्रक्रिया है जिसमें पौधे सूर्य के प्रकाश और कार्बन डाइऑक्साइड से ग्लूकोज और ऑक्सीजन बनाते हैं।"
    },
    {
        "query_id": "q_bn_001",
        "language": "bn",
        "query": "ভারতের জাতীয় সঙ্গীত কোনটি এবং এটি কে রচনা করেছেন?",
        "passage_id": "pass_bn_001",
        "passage_text": "ভারতের জাতীয় সঙ্গীত হল 'জন গণ মন'। এটি বিশ্বকবি রবীন্দ্রনাথ ঠাকুর দ্বারা মূল সংস্কৃতঘেঁষা বাংলায় রচিত হয়েছিল। ১৯৫০ সালের ২৪ জানুয়ারি এটি আনুষ্ঠানিকভাবে স্বাধীন ভারতের জাতীয় সঙ্গীত হিসেবে গৃহীত হয়।",
        "is_selected": 1,
        "well_formed_answer": "ভারতের জাতীয় সঙ্গীত হল 'জন গণ মন', যা রবীন্দ্রনাথ ঠাকুর রচনা করেছেন।"
    },
    {
        "query_id": "q_ta_001",
        "language": "ta",
        "query": "தமிழ்நாட்டின் தலைநகரம் எது?",
        "passage_id": "pass_ta_001",
        "passage_text": "சென்னை தமிழ்நாட்டின் தலைநகரம் மற்றும் மிகப்பெரிய நகரமாகும். இது வங்காள விரிகுடாவின் கொரமண்டல் கரையில் அமைந்துள்ளது. சென்னை தென்னிந்தியாவின் கலாச்சார, பொருளாதார এবং கல்வி மையங்களில் ஒன்றாகும்.",
        "is_selected": 1,
        "well_formed_answer": "தமிழ்நாட்டின் தலைநகரம் சென்னை ஆகும்."
    },
    {
        "query_id": "q_te_001",
        "language": "te",
        "query": "హైదరాబాద్ నగరం ఏ నది ఒడ్డున ఉంది?",
        "passage_id": "pass_te_001",
        "passage_text": "హైదరాబాద్ నగరం మూసీ నది ఒడ్డున ఉంది. ఇది తెలంగాణ రాష్ట్ర రాజధాని మరియు భారతదేశంలో ప్రముఖ సమాచార సాంకేతిక (IT) కేంద్రం.",
        "is_selected": 1,
        "well_formed_answer": "హైదరాబాద్ నగరం మూసీ నది ఒడ్డున ఉంది."
    },
    {
        "query_id": "q_mr_001",
        "language": "mr",
        "query": "महाराष्ट्राची आर्थिक राजधानी कोणती आहे?",
        "passage_id": "pass_mr_001",
        "passage_text": "मुंबई ही महाराष्ट्र राज्याची राजधानी असून भारताची आर्थिक राजधानी मानली जाते. येथे बॉम्बे स्टॉक एक्सचेंज (BSE) आणि रिझर्व्ह बँक ऑफ इंडिया (RBI) चे मुख्यालय आहे.",
        "is_selected": 1,
        "well_formed_answer": "मुंबई ही महाराष्ट्राची आणि भारताची आर्थिक राजधानी आहे."
    },
    {
        "query_id": "q_gu_001",
        "language": "gu",
        "query": "ગુજરાતનું સૌથી મોટું શહેર કયું છે?",
        "passage_id": "pass_gu_001",
        "passage_text": "અમદાવાદ ગુજરાતનું સૌથી મોટું શહેર અને ભૂતપૂર્વ રાજધાની છે. તે સાબરમતી નદીના કિનારે આવેલું છે અને તેના સુતરાઉ કાપડ ઉદ્યોગ માટે જાણીતું છે.",
        "is_selected": 1,
        "well_formed_answer": "ગુજરાતનું સૌથી મોટું શહેર અમદાવાદ છે."
    },
    {
        "query_id": "q_kn_001",
        "language": "kn",
        "query": "ಕರ್ನಾಟಕದ ರಾಜಧಾನಿ ಯಾವುದು?",
        "passage_id": "pass_kn_001",
        "passage_text": "ಬೆಂಗಳೂರು ಕರ್ನಾಟಕದ ರಾಜಧಾನಿಯಾಗಿದೆ. ಇದನ್ನು 'ಭಾರತದ ಸಿಲಿಕಾನ್ ವ್ಯಾಲಿ' ಎಂದು ಕರೆಯಲಾಗುತ್ತದೆ ಏಕೆಂದರೆ ಇದು ದೇಶದ ಪ್ರಮುಖ IT ತಂತ್ರಜ್ಞಾನ ಕೇಂದ್ರವಾಗಿದೆ.",
        "is_selected": 1,
        "well_formed_answer": "ಕರ್ನಾಟಕದ ರಾಜಧಾನಿ ಬೆಂಗಳೂರು."
    },
    {
        "query_id": "q_ml_001",
        "language": "ml",
        "query": "കേരളത്തിന്റെ തലസ്ഥാനം ഏതാണ്?",
        "passage_id": "pass_ml_001",
        "passage_text": "തിരുവനന്തപുരം ആണ് കേരളത്തിന്റെ തലസ്ഥാനം. ഇത് മുൻപ് ട്രിവാൻഡ്രം എന്നറിയപ്പെട്ടിരുന്നു.",
        "is_selected": 1,
        "well_formed_answer": "കേരളത്തിന്റെ തലസ്ഥാനം തിരുവനന്തപുരം ആണ്."
    },
    {
        "query_id": "q_pa_001",
        "language": "pa",
        "query": "ਪੰਜਾਬ ਦੀ ਰਾਜਧਾਨੀ ਕਿਹੜੀ ਹੈ?",
        "passage_id": "pass_pa_001",
        "passage_text": "ਚੰਡੀਗੜ੍ਹ ਪੰਜਾਬ ਅਤੇ ਹਰਿਆਣਾ ਦੋਵਾਂ ਰਾਜਾਂ ਦੀ ਸਾਂਝੀ ਰਾਜਧਾਨੀ ਹੈ। ਇਹ ਭਾਰਤ ਦਾ ਇੱਕ ਕੇਂਦਰ ਸ਼ਾਸਤ ਪ੍ਰਦੇਸ਼ ਵੀ ਹੈ।",
        "is_selected": 1,
        "well_formed_answer": "ਪੰਜਾਬ ਦੀ ਰਾਜਧਾਨੀ ਚੰਡੀਗੜ੍ਹ ਹੈ।"
    },
    {
        "query_id": "q_en_001",
        "language": "en",
        "query": "What is Retrieval-Augmented Generation (RAG)?",
        "passage_id": "pass_en_001",
        "passage_text": "Retrieval-Augmented Generation (RAG) is an AI framework that enhances Large Language Models (LLMs) by pulling relevant facts from external knowledge databases or vector indexes before generating responses, thereby reducing hallucinations and providing up-to-date grounded information.",
        "is_selected": 1,
        "well_formed_answer": "Retrieval-Augmented Generation (RAG) is an AI architecture that retrieves external reference documents to ground LLM responses with factual data."
    },
    {
        "query_id": "q_en_002",
        "language": "en",
        "query": "How does speech recognition work in real-time streaming STT?",
        "passage_id": "pass_en_002",
        "passage_text": "Real-time streaming Speech-to-Text (STT) models like Sarvam AI's Saaras v3 ingest continuous chunked audio frames over WebSockets. They compute acoustic spectral features and process token outputs incrementally with low Time-To-First-Token (TTFT <150ms) and built-in Voice Activity Detection (VAD).",
        "is_selected": 1,
        "well_formed_answer": "Streaming STT ingests audio chunks over WebSockets, outputting partial transcripts continuously with sub-150ms latency."
    }
]

def load_msmarco_xi_passages() -> List[Dict[str, Any]]:
    """Return MSMARCO-XI dataset passages."""
    return MSMARCO_XI_SAMPLE_DATA

def get_passages_by_language(lang_code: str) -> List[Dict[str, Any]]:
    """Filter dataset by language code."""
    return [p for p in MSMARCO_XI_SAMPLE_DATA if p.get("language") == lang_code]
