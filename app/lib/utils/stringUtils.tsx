export const truncatedText = (text: string, maxLength: number = 10): string => {
    return (text.length > maxLength ) ? text.slice(0, maxLength) + '...' : text;
}

export const capitalizeFirstLetterOfEachWord = (str: string) => {
    return str.split(' ').map((word: string, idx: number) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }