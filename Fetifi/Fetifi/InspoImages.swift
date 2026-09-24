import Foundation
import UIKit

enum InspoImages {
    private static var folder: URL {
        let dir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("inspo", isDirectory: true)
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        return dir
    }

    static func save(_ data: Data) -> String {
        let name = UUID().uuidString + ".jpg"
        let jpeg = UIImage(data: data)?.jpegData(compressionQuality: 0.72) ?? data
        try? jpeg.write(to: folder.appendingPathComponent(name), options: .atomic)
        return name
    }

    static func load(_ name: String) -> UIImage? {
        UIImage(contentsOfFile: folder.appendingPathComponent(name).path)
    }

    static func delete(_ name: String) {
        try? FileManager.default.removeItem(at: folder.appendingPathComponent(name))
    }
}
