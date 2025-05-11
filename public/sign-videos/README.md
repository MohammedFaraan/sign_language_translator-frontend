# Sign Language Video Assets

This directory is intended to store sign language videos for the application.

## Video Format Requirements

- All videos should be in `.mp4` format
- Each video file should be named according to the word it represents (e.g., "hello.mp4")
- Videos should be high quality but optimized for web delivery
- Recommended resolution: 720p (1280x720)
- Recommended codec: H.264
- Average length: 2-5 seconds per word

## Default Available Words

The application is configured to recognize the following words by default:

- hello
- world
- thank
- you
- please
- yes
- no
- what
- who
- how
- help
- good
- bad
- sorry
- name
- sign
- language
- learn
- deaf
- hearing

## Adding New Videos

To add support for new words:

1. Add the video file to this directory (e.g., "example.mp4")
2. Update the `availableWords` array in `/src/utils/textProcessing.ts` to include the new word

## Video Sourcing Guidelines

When recording or sourcing sign language videos:

1. Ensure videos are culturally appropriate and accurate
2. Consider using professional sign language interpreters
3. Maintain consistent framing, lighting, and background
4. Ensure proper permissions and licensing are in place