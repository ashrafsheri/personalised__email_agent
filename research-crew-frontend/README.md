# Research Crew Frontend

This project is a Next.js application designed to interact with the Research Crew API. It allows users to input a company name and receive a generated email based on that input.

## Features

- User-friendly interface for entering company names.
- Displays generated emails based on API responses.
- Loading indicator while API calls are being processed.

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/research-crew-frontend.git
   cd research-crew-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

## Project Structure

- `src/app`: Contains the main application files including pages and global styles.
- `src/components`: Contains reusable components such as forms and output displays.
- `src/lib`: Contains API interaction logic.
- `src/types`: Contains TypeScript types and interfaces.

## API Integration

The application communicates with the Research Crew API to generate emails based on the company name provided by the user. Ensure that the API is running and accessible.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.