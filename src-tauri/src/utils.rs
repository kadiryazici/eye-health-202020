use std::{fs::File, io::BufReader, path::PathBuf};

use rodio::{Decoder, OutputStream, Sink};

pub fn play_sound(audio_path: PathBuf) {
    std::thread::spawn(move || {
        let file = File::open(audio_path).unwrap();
        let buf_reader = BufReader::new(file);
        let source = Decoder::new(buf_reader).unwrap();
        let (_stream, stream_handle) = OutputStream::try_default().unwrap();
        let sink = Sink::try_new(&stream_handle).unwrap();

        sink.append(source);
        sink.sleep_until_end();
    });
}
