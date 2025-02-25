import java.io.ByteArrayOutputStream

val branch: String by project
val snapshot: String by project

mapOf(
  "ihomeVersion" to if ("true".equals(snapshot)) "git tag --sort=-committerdate".runCommand() + "git rev-parse --short HEAD".runCommand()
  else "git tag --sort=-committerdate".runCommand()
).forEach { (name, version) ->
  project.extra.set(name, version)
}

fun String.runCommand(currentWorkingDir: File = file("./")): String {
  val byteOut = ByteArrayOutputStream()
  project.exec {
    workingDir = currentWorkingDir
    commandLine = this@runCommand.split("\\s".toRegex())
    standardOutput = byteOut
  }
  return String(byteOut.toByteArray()).trim().split("\n").get(0)
}
