export const GIVER_STEPS = [
  { title: "Sign in and post", body: "Add photos, a name, the condition and the area. Your exact address is never shown." },
  { title: "We take a quick look", body: "A volunteer checks every new post. Once approved, it appears for everyone." },
  { title: "Choose who gets it", body: "People ask for your item and leave a phone number. If several ask, you pick one." },
  { title: "Hand it over", body: "Call them, agree a time and place, then mark the item as given." },
] as const;

export const SEEKER_STEPS = [
  { title: "Look around", body: "Browse or search by place, category and condition. You don't need an account to look." },
  { title: "Ask for it", body: "Sign in, add your phone number and a short note, then send your request. It's free." },
  { title: "Wait for the giver", body: "The giver may accept or decline. You can cancel your request at any time." },
  { title: "Collect it", body: "If accepted, the giver gets in touch and shares the pickup spot. Say thank you." },
] as const;

export const SAFETY_POINTS = [
  "Your phone number is shown only to the giver of the item you ask for.",
  "The exact pickup address is shared only after the giver accepts your request.",
  "Nothing is for sale here. Never pay anyone, and report anyone who asks for money.",
  "Meet in a public or well-lit place if you can, and bring a friend for large items.",
] as const;

export const FAQ = [
  { question: "Does it cost anything?", answer: "No. Every item is free, and GiveAgain never takes payment." },
  { question: "Do I need an account?", answer: "Only to give something away or ask for an item. Browsing is open to everyone." },
  { question: "Can I ask for my own item?", answer: "No. Your own listings are for others to ask for." },
  { question: "What can I give away?", answer: "Everyday things that still work or can be used again. Some items, such as weapons or medicines, are not allowed." },
  { question: "What if the giver doesn't reply?", answer: "Cancel your request and ask for another item. You can also report a problem from the item page." },
] as const;
