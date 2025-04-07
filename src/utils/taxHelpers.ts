
export const textToNumber = (text: string): number | string => {
    const numberWords: { [key: string]: number } = {
        zero: 0,
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10,
    };
    const lowerText = text.toLowerCase().trim();
    return numberWords[lowerText] !== undefined ? numberWords[lowerText] : "";
};

export const numberToText = (number: number): string => {
    const numberWords: { [key: number]: string } = {
        0: "zero",
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six",
        7: "seven",
        8: "eight",
        9: "nine",
        10: "ten",
    };
    return numberWords[number] || "";
};
