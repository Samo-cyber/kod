from PIL import Image
import sys

def remove_black_background(input_path, output_path):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Check if the pixel is black (or very close to black)
            # You can adjust the threshold (30) as needed
            if item[0] < 30 and item[1] < 30 and item[2] < 30:
                newData.append((0, 0, 0, 0))  # Make it transparent
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully saved transparent image to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    remove_black_background("public/logo.jpg", "public/logo.png")
