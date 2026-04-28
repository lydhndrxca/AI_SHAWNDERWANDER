# one-off: generate dating profile JSON ranking
import json

def entry(photo, ov, atr, pq, ps, cs, slot, s1, s2):
    return {
        "photo": photo,
        "overall_score": ov,
        "attractiveness": atr,
        "photo_quality": pq,
        "personality_signal": ps,
        "conversation_starter": cs,
        "best_slot": slot,
        "strengths": [s1, s2],
    }


rows = []

def w(photo, ov, atr, pq, ps, cs, slot, s1, s2, w1, w2):
    e = entry(photo, ov, atr, pq, ps, cs, slot, s1, s2)
    e["weaknesses"] = [w1, w2]
    rows.append(e)


w("2025-12-06_19-35-31_1.jpg", 7, 7, 8, 7, 9, 4, "High production group holiday energy", "You are centered and genuinely smiling", "Never use as lead; friend confusion risk", "Busy graphic sweatshirt")
w("3068761511511815388.jpg", 5, 6, 7, 8, 8, 5, "Soft window light at home", "Warm domestic vibe", "Child in frame polarizes quickly", "Squinting closes off eye sparkle")
w("41DFCBC7-020E-45D9-B813-573835898BAA.jpg", 5, 5, 6, 9, 10, 6, "Memorable comedic prop", "Shows confidence to be weird", "Muscle costume read as joke not fitness", "Muted indoor filter feel")
w("5E1A5F54-0660-43DC-BF80-A17191AFBEB7.jpg", 7, 7, 8, 7, 8, 6, "Outdoor natural light", "Duchenne smile with eye contact", "Not a true standing proportions frame", "Trucker hat hides hair")
w("6546012241487550595.jpg", 8, 8, 8, 8, 8, 4, "Shared guitar moment", "Window daylight + big smile", "Second person competes for focal weight", "Repeated Buscadero hat motif")
w("6D34963C-3691-42FF-8138-DBBC669AFD08.jpg", 6, 7, 8, 8, 8, 3, "Clean bright kitchen context", "Clearly a practicing musician", "No smile; eyes on strings", "Motion blur on picking hand")
w("7544A32A-B0F3-4C8E-A8E2-5D21F0C835D1.jpg", 7, 7, 8, 7, 7, 4, "Social bar lighting flattering", "Glassware adds lifestyle polish", "Interior not outdoor boost", "Cap shadows upper face")
w("7986B827-2990-4D17-B200-A20D61C05692.jpg", 8, 8, 9, 8, 8, 3, "Visible production lights + mic cue creative career", "Genuine smile with crinkle lines", "Looks off camera; weak for slot 1", "Studio not nature light")
w("9191AE9F-854F-457B-A990-7FC9BB43DEA6.jpg", 7, 7, 8, 8, 9, 6, "Ripley's color bomb", "Full body + prop comb", "Tourism kitsch not everyday style", "Soft smile vs party setting")
w("978E1CA0-6E92-45FA-ADDB-8C9B01A5FF1A.jpg", 4, 6, 7, 6, 7, 6, "Shows consistent gym routine", "Iced coffee twist humanizes", "Major mirror-in-gym swipe penalty", "Brim shadows eyes")
w("9A327F49-83B4-4948-B604-AC9CF98E92D3.jpg", 4, 5, 5, 4, 3, 1, "Cold-weather rugged framing", "Nighttime story", "Harsh flash flattening", "No Duchenne warmth")
w("AAA93E92-A9D7-4CF7-BABE-C7CBA23FEBFC.jpg", 5, 6, 7, 5, 5, 4, "Rustic supper club mood", "Shows you dine out deliberately", "Serious face under hat brim", "Dim wood interior")
w("AE57105E-A88B-4237-B034-3155B4E08134.jpg", 8, 8, 8, 7, 7, 1, "Brick bokeh crisp", "Crow-foot smile believable", "Stray hair edge hints crop from duo shot", "Hat conceals hair detail")
w("D32D54A6-69A2-4974-A893-4F3503D04A42.jpg", 6, 6, 6, 9, 10, 3, "Glow text sets moody art moment", "Hands-on gear signals creative job", "Grainy night profile lacking eyes", "Reads work not date")
w("D3CC2923-4B7B-4259-94A6-95427D0362A9.jpg", 8, 8, 8, 8, 8, 3, "Real outdoors adventure", "River + sun read active", "Others on bank even if distant", "Seated not full standing body line")
w("D436D44C-3BFE-40D0-A83E-00E169FF0981.jpg", 6, 6, 8, 6, 8, 6, "Golden rails leading lines", "Calm styling", "Zero eye contact smiling", "Muted expression can read aloof")
w("D46E9161-920B-4F72-9A76-80B556B45A09.jpg", 6, 6, 7, 9, 9, 6, "Skeleton coworker gag", "Story overlay personality", "'Office mates' text feels IG-screenshot", "Not a hinge-polished vibe")
w("D4A59B78-E4CB-461D-AE16-CF874C6B13AF.jpg", 8, 8, 8, 8, 9, 5, "Dog halo effect credible", "Wood trail sun", "Duplicates similar dog leash shots elsewhere", "Harness saturation loud")
w("E42476D0-53E5-4447-B91C-3A9BB6C37920.jpg", 9, 9, 9, 7, 6, 1, "Poster outdoor portrait smile", "Even soft daylight forgiving", "Ultra casual hoodie anonymity", "No hobby props")
w("F7FCF239-C519-44A9-B075-E49513A63EC4.jpg", 7, 7, 7, 7, 6, 5, "Candid grin at table", "Modern bar wood slat ceiling detail", "Eyes aimed down at moment", "Noise in low ambience")
w("Facetune_09-01-2026-17-14-19.jpg", 7, 7, 6, 7, 6, 1, "Smart casual stacked layers", "Lean-in pose engagement", "Soft resolution hurts crispness", "Indoor ambience not airy")
w("Facetune_16-01-2026-09-39-15.jpg", 9, 9, 9, 7, 6, 1, "Outstanding outdoor grin benchmark", "Bokeh park separation', 'Facetune filename may trigger polish skepticism", "Repeated navy hoodie motif")
w("Facetune_16-01-2026-10-00-28.jpg", 7, 7, 8, 8, 9, 3, "Horse herd background unique", "Western styling cohesive", "Standard arm-length selfie tells", "Competes with IMG_0849 duplicate idea")
w("Facetune_30-05-2025-12-05-36.jpg", 8, 8, 8, 7, 7, 5, "Dapple canopy premium feel', 'Relaxed approachable warmth", "Hat + thin chain edging try-hard?", "Landscape portrait not activity motion")
w("FB72ABFD-7107-4EA2-A711-133C0A7C56D1.jpg", 5, 6, 8, 10, 10, 6, "Glitter fun creative fearless", "Duchenne in mirror uncommon", "Mirror selfie penalty plus gear clutter', 'Studio tinsel chaotic")
w("IMG_0068.jpg", 4, 5, 7, 6, 5, 6, "Statement glasses moment", "Moody terracotta restroom palette", "Mirror selfie no smile harsh rule", "Dim restroom tone")
w("IMG_0071.jpg", 2, 3, 2, 5, 6, 6, "Attempt at brand hat continuity", "", "Heavy mirror fog noise disaster", "Unusable first-impression contender")
w("IMG_0131.jpg", 6, 6, 7, 6, 8, 4, "Natural foliage bokeh trio balance", "You still read as centerpiece", "Two women flank risk mixed signals', 'Sunset warmth slightly filtered")
w("IMG_0136.jpg", 5, 5, 6, 9, 10, 6, "Comedic commitment again", 'Deadpan meme energy", "Grain + dim interior duplication", 'Same gag as anatomical bodysuit file')
w("IMG_0138.jpg", 7, 7, 8, 9, 10, 3, "Trip guitar authenticity", 'Camp storytelling depth", "Tunnel vision on fretboard skips eyes", 'Knee hole pants polarizing polish')
w("IMG_0140.jpg", 6, 6, 8, 5, 8, 6, "Canary hat brand signal", 'Sunny pavement clarity', 'Off-axis gaze forsakes hook', 'Brim shading eyes')
w("IMG_0411.jpg", 7, 7, 8, 7, 8, 1, 'Skyline pastel dramatic', 'Canada Goose prestige outerwear layer', 'Beanie hides haircut info', 'Closed mouth smile subdued')
w("IMG_0699.jpg", 6, 6, 8, 7, 8, 4, 'Scenic overlook squad', 'Big sky landscape context', 'Tight selfie crowding trio', 'Brim shadows eyes vs sun')
w("IMG_0756.jpg", 7, 7, 8, 7, 7, 5, 'Lakefront calm luxury', 'Belted jacket flattering silhouette', 'Repeat Buscadero iconography fatigue', 'Still hat-first catalog')
w("IMG_0826.jpg", 7, 7, 6, 7, 7, 4, 'Night-out proof of social life', 'Big smile forefront', 'ISO grain + flash selfie tells', 'Not lifestyle daylight tier')
w("IMG_0849.jpg", 7, 7, 8, 8, 9, 3, 'Riders background narrative', 'Outdoor saturation crisp', 'Redundant ranch scene if Facetune kept', 'Selfie distortion mild')
w("IMG_0911.jpg", 4, 5, 7, 5, 4, 6, 'Vintage Super Bowl merch personality', '', 'Classic bathroom gaze-down mirror fail', 'Clutter countertop distraction')
w("IMG_0950.jpg", 5, 6, 8, 6, 7, 6, 'Psychedelic mirror maze intrigue', '', 'Mirror selfie gaze down sterile face', 'Overwhelming pattern noise')
w("IMG_1004.jpg", 5, 5, 6, 5, 6, 5, 'Diner Americana tableau', '', 'Neutral bored gaze away', 'Crowded diner background steals focus')
w("IMG_1132.jpg", 7, 7, 7, 7, 8, 1, 'Ornate wallpaper premium interior', 'Direct eye softer smile workable', 'Indoor lacks nature boost', 'Baseball hat again')
w("IMG_1852.jpg", 6, 6, 8, 8, 7, 4, 'Multi-gen music moment warm', '', 'You are ancillary to pianist story', 'Children may raise privacy chatter')
w("IMG_1939.jpg", 6, 7, 6, 7, 7, 3, 'Backpack trekking prep candid', '', 'Bloom haze softness low crispness', 'Smirk subdued not inviting lead')
w("IMG_2129.jpg", 7, 7, 7, 7, 6, 5, 'Unposed laugh sincerity', '', 'Restaurant noise artifacts', 'Hat shadow nighttime')
w("IMG_2131.jpg", 8, 8, 8, 8, 8, 4, 'Even dine-out confidence', 'Greenery ceiling cinematic', 'Synthetic night light vs daylight slots', 'Slight hat occlusion')
w("IMG_2176.jpg", 6, 6, 8, 7, 7, 3, 'Forest trail sporty', '', 'Wayfarers block connection eyes penalized elsewhere', 'Selfie posture obvious')
w("IMG_2194.jpg", 6, 6, 7, 7, 7, 4, 'Charcuterie date energy', '', 'Grain + tilt selfie casual', 'Tablemates pull attention equity')
w("IMG_2787.jpg", 7, 7, 8, 8, 9, 6, 'Stained glass scale wow', '', 'Muted smile understatement', 'Indoor skylight artificial balance')
w("IMG_2865.jpg", 9, 9, 9, 8, 7, 1, 'Near textbook outdoor smile', '', 'Twin near duplicate of IMG_2866 elsewhere', '')
w("IMG_2866.jpg", 9, 9, 9, 8, 7, 1, 'Outstanding clarity + warmth', '', 'Ultra safe hoodie uniformity', '')
w("IMG_2924.jpg", 7, 7, 7, 7, 8, 6, 'City observation deck intrigue', '', 'Diamond mesh distracting gridlines', 'Adult wristband tourist detail minor')
w("IMG_3143.jpg", 6, 6, 6, 10, 9, 6, 'Miniature obsessive hobby nerd hook', '', 'Grainy dark tabletop focus inward', '')
w("IMG_3162.jpg", 7, 7, 8, 7, 8, 3, 'Outdoor forest hiking palette', '', 'Sunglasses break eye-connection rule caution', '')
w("IMG_3229.jpg", 6, 6, 7, 6, 7, 2, 'Full athletic swing silhouette', '', 'Grainy quasi-video grab face hidden', '')
w("IMG_3284.jpg", 4, 5, 6, 6, 5, 6, 'Leopard fleece bold fashion risk', '', 'Mirror glare half-smile lukewarm eyes', '')
w("IMG_3483.jpg", 7, 7, 7, 6, 6, 1, 'Tight grin selfie workable', '', 'Domestic bookcase bokeh chatter', '')
w("IMG_3780.jpg", 7, 7, 7, 10, 9, 6, 'Vibrant miniature world lighting art', '', 'Downcast focus no engagement', '')
w("IMG_3904.jpg", 7, 7, 8, 8, 9, 3, 'Onewheel motion dynamic unique', '', 'No smile + looking away kinetic only', '')
w("IMG_4333.jpg", 8, 8, 9, 9, 8, 3, 'B&W prestige interview vibes', '', 'Looks right not lens', '')
w("IMG_4336.jpg", 8, 8, 7, 7, 7, 5, 'Turtleneck chic cafe smile', '', 'Indoor softness not flagship crisp', '')
w("IMG_4337.jpg", 8, 8, 8, 9, 9, 5, 'Dog + snow grin emotional peak', '', 'Winter coat hides torso shape cues', '')
w("IMG_4377.jpg", 8, 8, 8, 8, 9, 5, 'Leafy trail dog synergy', '', 'Similar outfit repeat soon after other dog shot', '')
w("IMG_4378.jpg", 8, 8, 9, 9, 8, 3, 'Studio chair commanding presence', '', 'Off-axis gaze marketing still not dating lead optimal', '')
w("IMG_4379.jpg", 7, 7, 8, 10, 8, 3, 'Recording grin mic foreground depth', '', 'B&W hides skin warmth; staring down workload', '')
w("IMG_4679.jpg", 4, 5, 4, 5, 4, 4, 'Bar intimacy mood', '', 'Heavy noise partial stranger cropped', '')
w("IMG_5049.jpg", 6, 6, 7, 5, 5, 5, 'Autumn foliage palette painterly bokeh', '', 'Beanie hides hairline asymmetry suspicion', '')
w("IMG_5120.jpg", 7, 7, 8, 7, 7, 4, 'Tequila bar greenery repeat friendlier smile alt', '', 'Night interior duplicate slot fight with IMG_2131 etc', '')
w("IMG_5206.jpg", 6, 6, 7, 8, 7, 3, 'Square crops modern IG feel', '', 'Duplicate kitchen guitar beat earlier file', '')
w("IMG_5292.jpg", 7, 7, 6, 6, 5, 4, 'Big smile nostalgic print texture', '', 'Another woman cropping dating ambiguity', '')
w("IMG_5971.jpg", 6, 6, 7, 6, 6, 2, 'Sunny turf athletic lines', '', 'Face blocked arm swing worthless match clarity', '')
w("IMG_7115.jpg", 7, 7, 7, 9, 9, 6, 'RGB nerd cred aligns career', '', 'Selfie gamer den colored cast', '')
w("IMG_7889(1).jpg", 7, 7, 8, 7, 8, 4, 'Daylight taco lunch urban glass', '', 'Profile view eschews eye tether', '')
w("IMG_7954.jpg", 7, 7, 8, 5, 6, 2, 'Rare full-body daytime sidewalk proportions honest', '', 'Neutral serious face wastes smile conversion', '')
w("IMG_8724.jpg", 4, 5, 5, 4, 4, 2, '', '', 'Bright cap bathroom toiletries clutter grim mirror selfie', '')
w("IMG_9247.jpg", 7, 7, 8, 7, 9, 4, 'Play-muscle gag defangs gym hostility', '', 'Still inherently gymnasium DNA penalty sensitivity', '')
w("IMG_9510.jpg", 4, 5, 5, 6, 7, 6, 'Neon immersion art selfie', '', 'Heavy magenta monochrome filter swipe hazard', '')
w("IMG_9717.jpg", 7, 7, 6, 7, 7, 4, 'Bar dollar ceiling iconic Madison energy', '', 'Crowded selfie ISO noise middling polish', '')
# fix lines with quoting errors manually - script may have syntax issues

PY
