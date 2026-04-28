#!/usr/bin/env python3
import json

R = []


def w(photo, ov, atr, pq, ps, cs, slot, s1, s2, w1, w2):
    R.append(
        {
            "photo": photo,
            "overall_score": ov,
            "attractiveness": atr,
            "photo_quality": pq,
            "personality_signal": ps,
            "conversation_starter": cs,
            "best_slot": slot,
            "strengths": [s1, s2],
            "weaknesses": [w1, w2],
        }
    )


w("2025-12-06_19-35-31_1.jpg", 7, 7, 7, 8, 8, 4, "Centered in a five-person holiday shot", "All subjects smiling", "Synthetic-looking snowy backdrop", "Crowded; not a solo lead")
w("3068761511511815388.jpg", 5, 6, 8, 7, 6, 5, "Soft window light; cozy home mood", "Clear father-child warmth", "Child in frame polarizes some swipers", "Beanie and gaiter obscure detail")
w("41DFCBC7-020E-45D9-B813-573835898BAA.jpg", 4, 5, 4, 9, 9, 6, "Unforgettable anatomy-suit gag", "Dry deadpan commitment", "Dim indoor; no smile", "Duplicate idea versus IMG_0136")
w("5E1A5F54-0660-43DC-BF80-A17191AFBEB7.jpg", 7, 7, 8, 7, 8, 2, "Outdoor soft light; smile; eye contact", "Reads full-length with statue prop", "Ponderosa kitsch can read silly", "Not a dog; statue humor only")
w("6546012241487550595.jpg", 9, 8, 9, 10, 9, 3, "Guitar plus friend proves musician socially", "Window daylight warmth", "Second person splits attention", "Buscadero hat repeats across set")
w("6D34963C-3691-42FF-8138-DBBC669AFD08.jpg", 6, 7, 8, 8, 6, 3, "Bright kitchen; guitar activity clear", "Motion on strumming hand", "No smile to camera", "Duplicates kitchen guitar versus IMG_5206")
w("7544A32A-B0F3-4C8E-A8E2-5D21F0C835D1.jpg", 7, 7, 7, 7, 6, 5, "Smile and eye contact in upscale bar", "Drink adds lifestyle beat", "Indoor amber not outdoor boost", "Brim shadows eyes")
w("7986B827-2990-4D17-B200-A20D61C05692.jpg", 8, 8, 9, 9, 7, 3, "Broadcast mic plus softbox; creative career proof", "Warm off-camera smile", "No lens eye contact", "Looks like a reel still not a date vibe")
w("9191AE9F-854F-457B-A990-7FC9BB43DEA6.jpg", 8, 7, 8, 9, 10, 6, "Ripley's color and texture spectacle", "Full-body tourist wildcard", "Kitsch overshadows intimacy", "Indoor attraction lighting")
w("978E1CA0-6E92-45FA-ADDB-8C9B01A5FF1A.jpg", 3, 5, 6, 5, 5, 2, "Shows gym consistency", "Coffee prop humanizes", "Mirror gym selfie double penalty", "Eyes on phone reflection")
w("9A327F49-83B4-4948-B604-AC9CF98E92D3.jpg", 3, 4, 3, 4, 3, 6, "At least frontal face", "Beanie rugged frame", "Night flash flattening", "No smile warmth")
w("AAA93E92-A9D7-4CF7-BABE-C7CBA23FEBFC.jpg", 4, 5, 5, 5, 6, 4, "Steakhouse dinner story", "Wood tavern ambience", "Serious utensils pose", "Indoor dim")
w("AE57105E-A88B-4237-B034-3155B4E08134.jpg", 8, 8, 8, 7, 6, 1, "Strong outdoor Duchenne; brick blur", "Direct eye engagement", "Stray hair edge implies crop", "Heavy Buscadero brand repetition")
w("D32D54A6-69A2-4974-A893-4F3503D04A42.jpg", 5, 5, 5, 9, 10, 3, "Glow text cinematic hook", "Hands-on tech creative job", "Dark profile swipe hazard", "No smile")
w("D3CC2923-4B7B-4259-94A6-95427D0362A9.jpg", 9, 8, 9, 8, 8, 2, "Real river and forest scale", "Smile eye contact daylight", "Distant hikers in frame", "Hat shades eyes subtly")
w("D436D44C-3BFE-40D0-A83E-00E169FF0981.jpg", 6, 7, 8, 6, 7, 6, "Railroad lines and blue hour sky", "Moody color grade", "No smile or eye contact", "Reads aloof not warm")
w("D46E9161-920B-4F72-9A76-80B556B45A09.jpg", 6, 6, 6, 9, 9, 6, "Skeleton office humor lands", "Office window light", "Selfie lens distance", "Caption overlay feels story-export")
w("D4A59B78-E4CB-461D-AE16-CF874C6B13AF.jpg", 9, 8, 9, 9, 9, 5, "Dog trail smile eye contact stack", "Third-party composition", "Near-duplicate of IMG_4377", "Harness and bag busy")
w("E42476D0-53E5-4447-B91C-3A9BB6C37920.jpg", 9, 9, 9, 7, 6, 1, "Clean outdoor face-first smile", "Even park light; no hat shade", "Safe generic hoodie", "No hobby prop")
w("F7FCF239-C519-44A9-B075-E49513A63EC4.jpg", 6, 6, 6, 7, 5, 5, "Authentic laugh moment", "Feels friend-captured", "No eye contact", "Night grain and hat")
w("Facetune_09-01-2026-17-14-19.jpg", 7, 8, 6, 8, 6, 5, "Layered creative-pro styling", "Confident lean-in", "Indoor warm ambience only", "Facetune filename suspicion")
w("Facetune_16-01-2026-09-39-15.jpg", 8, 8, 8, 7, 6, 1, "Excellent outdoor smile benchmark", "Crisp face rendering", "Facetune filename", "Redundant with other park hoodies")
w("Facetune_16-01-2026-10-00-28.jpg", 7, 7, 8, 8, 9, 6, "Horses add western story", "Bandana styling", "Selfie arm length tell", "Competes with IMG_0849 ranch theme")
w("Facetune_30-05-2025-12-05-36.jpg", 8, 8, 8, 7, 7, 5, "Forest dapple light premium", "Relaxed seated warmth", "Buscadero cap again", "Edge crop artifact possible")
w("FB72ABFD-7107-4EA2-A711-133C0A7C56D1.jpg", 5, 6, 7, 10, 9, 6, "Glitter creative chaos energy", "Big smile in mirror", "Mirror selfie ranked down", "LED clutter foreground")
w("IMG_0068.jpg", 3, 4, 5, 5, 4, 6, "Glasses look defined", "Tile color story", "Bathroom mirror serious", "Not inviting")
w("IMG_0071.jpg", 2, 3, 2, 4, 4, 6, "Brand hat legible", "Attempt at continuity", "Foggy mirror disaster", "No smile; worst clarity")
w("IMG_0131.jpg", 8, 8, 8, 8, 8, 4, "Outdoor trio all smiling", "You stay central", "Women flanking may confuse", "Hats on all")
w("IMG_0136.jpg", 4, 5, 5, 8, 8, 6, "Muscle suit humor second take", "Same deadpan bit", "Grainy dim", "Keep one gag only")
w("IMG_0138.jpg", 7, 7, 7, 9, 9, 3, "Camp guitar butterfly Easter egg", "Trip authenticity", "Eyes on strings", "Busy gear foreground")
w("IMG_0140.jpg", 5, 6, 7, 6, 6, 5, "Yellow cap pop", "Sunny patio clarity", "Off-gaze; no smile", "Brim shadow risk")
w("IMG_0411.jpg", 8, 8, 9, 7, 7, 1, "Golden hour portrait mode", "Waterfront bokeh", "Parka bulk hides shape", "Sky line artifact minor")
w("IMG_0699.jpg", 7, 7, 7, 8, 7, 4, "Mountain scenic selfie", "Group warmth", "Foreshortening selfie", "Hat text looks misspelled")
w("IMG_0756.jpg", 7, 7, 8, 7, 6, 5, "Lake bench smile eye contact", "Outerwear silhouette", "Brim shadow on eyes", "Another Buscadero frame")
w("IMG_0826.jpg", 4, 5, 4, 7, 7, 4, "Night flash group joy", "You centered smile", "ISO noise ugly", "Dark venue fail")
w("IMG_0849.jpg", 7, 7, 8, 8, 9, 6, "Riders in field depth", "Outdoor face clarity", "Selfie vs Facetune duplicate", "Bandana costume risk")
w("IMG_0911.jpg", 3, 4, 6, 5, 5, 6, "Super Bowl merch personality", "Bathroom frame", "Eyes on phone", "Counter mess")
w("IMG_0950.jpg", 4, 5, 6, 6, 8, 6, "Mirror maze graphic pop", "Full environment story", "Mirror eyes on phone", "Visual chaos")
w("IMG_1004.jpg", 4, 4, 5, 5, 6, 5, "Diner Americana", "Packers shirt nod", "Neutral bored gaze", "Busy background")
w("IMG_1132.jpg", 7, 7, 8, 8, 8, 1, "Statement wallpaper location", "Smile plus eye contact", "Busy pattern competes", "Indoor only")
w("IMG_1852.jpg", 5, 5, 7, 8, 7, 4, "Multi-gen piano warmth", "Home music scene", "You are peripheral subject", "Kids privacy chatter")
w("IMG_1939.jpg", 5, 6, 5, 7, 7, 2, "Travel backpack prepping", "Graphic tee playful", "Hazy indoor softness", "Subtle smile only")
w("IMG_2129.jpg", 5, 6, 4, 7, 6, 5, "Big candid laugh sincerity", "Feels unstaged", "Motion blur grain", "Similar night Mexican spot as IMG_2131")
w("IMG_2131.jpg", 8, 8, 8, 8, 7, 5, "Night patio smile and eye contact", "Greenery ceiling cozy", "Indoor nightlife not daylight win", "Hoodie casual stack")
w("IMG_2176.jpg", 4, 5, 7, 6, 6, 3, "Forest trail outdoor light", "Backpack athlete signal", "Sunglasses break connection", "Hat shadow")
w("IMG_2194.jpg", 6, 6, 6, 7, 8, 4, "Charcuterie date energy", "Warm restaurant intimacy", "Selfie distortion", "Grain low light")
w("IMG_2787.jpg", 8, 8, 9, 8, 10, 6, "Stained glass scale traveler shot", "Backpack excursion implied", "Slight muted smile", "Wide tourist composition")
w("IMG_2865.jpg", 9, 9, 9, 8, 6, 1, "Outdoor textbook Duchenne", "Sharpest hoodie portrait series", "Near-twin IMG_2866", "Adds little beyond E424 duplicate")
w("IMG_2866.jpg", 8, 9, 9, 7, 6, 1, "Same winning hoodie smile", "Excellent clarity", "Portfolio repetition tax", "No new narrative")
w("IMG_2924.jpg", 7, 7, 7, 7, 8, 6, "Skydeck city lights leading lines", "Fence adds depth", "Wristband tourist tack", "Micro-smile only")
w("IMG_3143.jpg", 5, 5, 4, 10, 10, 6, "Miniature village obsession hook", "Story screenshot energy", "UI dots at bottom", "Dark soft focus")
w("IMG_3162.jpg", 4, 5, 7, 6, 7, 3, "Forest hike outdoor light", "Smirk energy", "Sunglasses eye block", "Forest selfie repeat")
w("IMG_3229.jpg", 5, 5, 5, 6, 7, 3, "Golf hobby visible", "Green course expanse", "Face lost in swing", "Pairs badly with IMG_5971 duplicate")
w("IMG_3284.jpg", 3, 4, 4, 7, 7, 6, "Leopard fleece bold", "Bathroom mirror classic fail", "Eyes on phone", "Half smile")
w("IMG_3483.jpg", 7, 7, 7, 6, 6, 1, "Home selfie tight grin", "Direct eye contact", "Domestic snapshot casual", "Waffle texture noise")
w("IMG_3780.jpg", 6, 6, 5, 10, 9, 6, "Hands in glowing miniature scene", "Better hobby lighting than IMG_3143", "Downward gaze", "Still niche dark")
w("IMG_3904.jpg", 7, 7, 8, 8, 9, 3, "Onewheel kinetic low angle", "Full-body proportions honest", "No smile engaged with ride", "Gadget bro split")
w("IMG_4333.jpg", 7, 8, 9, 9, 8, 3, "Black and white prestige interview", "Production gear legitimacy", "Eyes aimed off-camera", "Press-kit not flirty lead")
w("IMG_4336.jpg", 8, 8, 7, 8, 7, 5, "Cafe layering smile strong", "Hand near face intimacy", "Indoor softness grain", "Not flagship outdoor advantage")
w("IMG_4337.jpg", 9, 9, 9, 10, 10, 5, "Snow dog lap emotional apex", "Big outdoor grin", "Beanie hides hairline", "Sunglasses on jacket clip clutter")
w("IMG_4377.jpg", 8, 8, 8, 8, 8, 5, "Standing dog portrait duplicate strength", "Smile clarity", "If D4 stays this is redundant", "Harness saturation")
w("IMG_4378.jpg", 7, 7, 9, 9, 9, 3, "Director chair authority", "Huge smile sideways", "Dark void background", "No camera eyes")
w("IMG_4379.jpg", 8, 8, 8, 10, 9, 3, "Mic pop filter musician proof", "Joy at work vibe", "Eyes lowered to lyric sheet feel", "Monochrome wipes warmth cues")
w("IMG_4679.jpg", 3, 5, 3, 5, 4, 6, "Bar nightlife texture", "Hat continuity", "Heavy noise", "Background stranger crop")
w("IMG_5049.jpg", 5, 6, 7, 6, 6, 6, "Autumn bokeh serious mood", "Outdoor selfie arm vibe", "Off-gaze not swiping friendly", "Camo jacket divides taste")
w("IMG_5120.jpg", 7, 7, 7, 7, 7, 5, "Night patio smile clean", "Similar venue family to IMG_2131", "Indoor night slot competition", "Hoodie hat repeat")
w("IMG_5206.jpg", 6, 6, 8, 8, 7, 3, "Strum motion alive", "Kitchen bright", "No camera smile", "Redundant guitar story")
w("IMG_5292.jpg", 4, 6, 3, 5, 9, 6, "Photo-of-print meta joke", "Big smile memory", "Low fidelity scan", "Woman crop implies ex risk")
w("IMG_5971.jpg", 4, 5, 6, 6, 7, 3, "Sunny golf course", "Athletic lines", "Face hidden mid-swing", "Weak still quality")
w("IMG_7115.jpg", 6, 6, 6, 9, 10, 6, "RGB studio gamer identity", "Collectibles shelf story", "Purple gamer cast stigma", "Selfie LAN-party optics")
w("IMG_7889(1).jpg", 5, 6, 7, 6, 8, 5, "Daylight windows architectural", "Mandarin collar style", "Food mess foreground", "Gaze out window not lens")
w("IMG_7954.jpg", 5, 6, 7, 5, 7, 2, "Honest daytime full-body proportions", "Urban sidewalk framing", "Serious neutral face wastes smile cue", "Slightly vacant composition")
w("IMG_8724.jpg", 2, 3, 3, 3, 4, 6, "Aquarium novelty in reflection", "Domestic realism", "Bathroom mirror cluttered", "No smile engagement")
w("IMG_9247.jpg", 5, 7, 8, 7, 8, 4, "Buddy flex humor bright gym", "Both smiling at lens", "Gym-coded for haters", "Buddy steals half the frame")
w("IMG_9510.jpg", 3, 4, 3, 9, 10, 6, "Neon pink mirror art hook", "Bold color story", "Unnatural monochrome skin", "Mirror plus filter compounded")
w("IMG_9717.jpg", 6, 6, 5, 8, 9, 4, "Iconic crowded bar friendship", "Beer toast energy", "ISO noise weak polish", "Woman beside you jealousy optics")

assert len(R) == 76, len(R)

out = {
    "rankings": R,
    "top_6_lineup": [
        "E42476D0-53E5-4447-B91C-3A9BB6C37920.jpg",
        "D3CC2923-4B7B-4259-94A6-95427D0362A9.jpg",
        "6546012241487550595.jpg",
        "IMG_0131.jpg",
        "IMG_4337.jpg",
        "9191AE9F-854F-457B-A990-7FC9BB43DEA6.jpg",
    ],
    "lineup_reasoning": "Independent pass: Slot 1 is E42476D0 because it maximizes unobstructed daylight face, smile, and eye contact without hat shade or sunglasses—your Facetune-labeled repeats and IMG_2865/2866 triplets are downgraded for portfolio repetition even if pixels look great. Slot 2 is the river rock frame for a credible outdoor full-body read in real contrast and depth versus mirror and winter-bulk shots. Slot 3 is the shared guitar photo because it proves musician identity with another human in-frame—more alive than the kitchen head-down duplicates. Slot 4 is the outdoor trio: higher trust light than noisy bar selfies despite mixed-gender optics risk. Slot 5 is the snow lap dog shot because it concentrates dog, smile, outdoor light, and candid motion better than another standing leash duplicate. Slot 6 is Ripley's: full-body humor without another bathroom mirror, another tinted gym selfie, or a second anatomical gag.",
}

json.dump(out, open("_dating_photo_ranking.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print("written", len(R))
